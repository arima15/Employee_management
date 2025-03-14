import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Employee } from "../entity/employee";
import { Project } from "../entity/Project";
import { Like } from "typeorm";

export class EmployeeController {
  private employeeRepository = AppDataSource.getRepository(Employee);
  private projectRepository = AppDataSource.getRepository(Project);

  // Get all employees
  async getAllEmployees(req: Request, res: Response) {
    try {
      const employees = await this.employeeRepository.find({
        relations: ["department"],
      });
      return res.json(employees);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error fetching employees", error });
    }
  }

  // Get employee by ID
  async getEmployeeById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const employee = await this.employeeRepository.findOne({
        where: { id },
        relations: ["department"],
      });

      if (!employee) {
        return await res.status(404).json({ message: "Employee not found" });
      }
      return res.json(employee);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error fetching employee", error });
    }
  }

  // Create new employee
  async createEmployee(req: Request, res: Response) {
    try {
      const employee = this.employeeRepository.create(req.body);
      const result = await this.employeeRepository.save(employee);
      return res.status(201).json(result);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error creating employee", error });
    }
  }

  // Update employee
  async updateEmployee(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      let employee = await this.employeeRepository.findOneBy({ id });

      if (!employee) {
        return res.status(404).json({ message: "Employee not found" });
      }

      this.employeeRepository.merge(employee, req.body);
      const result = await this.employeeRepository.save(employee);
      return res.json(result);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error updating employee", error });
    }
  }

  // Delete employee
  async deleteEmployee(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      let employee = await this.employeeRepository.findOneBy({ id });

      if (!employee) {
        return res.status(404).json({ message: "Employee not found" });
      }

      await this.employeeRepository.remove(employee);
      return res.status(204).send();
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error deleting employee", error });
    }
  }

  // Assign employee to a project
  async assignToProject(req: Request, res: Response) {
    try {
      const employeeId = parseInt(req.params.id);
      const { projectId } = req.body;

      // Validate input
      if (!projectId) {
        return res.status(400).json({ message: "Project ID is required" });
      }

      // Find employee
      const employee = await this.employeeRepository.findOne({
        where: { id: employeeId },
        relations: ["projects"]
      });

      if (!employee) {
        return res.status(404).json({ message: "Employee not found" });
      }

      // Find project
      const project = await this.projectRepository.findOneBy({ id: projectId });

      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      // Add project to employee's projects
      if (!employee.projects) {
        employee.projects = [];
      }
      
      // Check if project is already assigned to avoid duplicates
      const isAlreadyAssigned = employee.projects.some(p => p.id === project.id);
      
      if (!isAlreadyAssigned) {
        employee.projects.push(project);
        await this.employeeRepository.save(employee);
        return res.status(200).json({ 
          message: "Employee assigned to project successfully",
          employee
        });
      } else {
        return res.status(400).json({ 
          message: "Employee is already assigned to this project" 
        });
      }
    } catch (error) {
      return res.status(500).json({ 
        message: "Error assigning employee to project", 
        error 
      });
    }
  }

  // Search employees by name
  async searchEmployeesByName(req: Request, res: Response) {
    try {
      let { name } = req.query;
      
      if (!name) {
        return res.status(400).json({ message: "Name parameter is required" });
      }
      
      // Convert name to string if it's not already
      name = String(name);
      
      // Remove quotes if they exist
      if (name.startsWith('"') && name.endsWith('"')) {
        name = name.substring(1, name.length - 1);
      }

      const employees = await this.employeeRepository.find({
        where: {
          name: Like(`%${name}%`)
        },
        relations: ["department"]
      });

      return res.json(employees);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error searching employees", error });
    }
  }
}
