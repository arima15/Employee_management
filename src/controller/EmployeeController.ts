import { Request, Response } from "express";
import { FileDatabase } from "../database/fileDatabase";
import { Employee } from "../entity/employee";
import { Department } from "../entity/Department";

export class EmployeeController {
  private employeeDatabase = new FileDatabase<Employee>("employees");
  private departmentDatabase = new FileDatabase<Department>("departments");

  // Get all employees
  async getAllEmployees(req: Request, res: Response) {
    try {
      const employees = await this.employeeDatabase.findAll();
      
      // Handle department relations manually
      for (const employee of employees) {
        if (employee.departmentId) {
          const department = await this.departmentDatabase.findById(employee.departmentId);
          if (department) {
            employee.department = department;
          }
        }
      }
      
      return res.json(employees);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error fetching employees", error: error.message });
    }
  }

  // Get employee by ID
  async getEmployeeById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const employee = await this.employeeDatabase.findById(id);

      if (!employee) {
        return res.status(404).json({ message: "Employee not found" });
      }
      
      // Handle department relation
      if (employee.departmentId) {
        const department = await this.departmentDatabase.findById(employee.departmentId);
        if (department) {
          employee.department = department;
        }
      }
      
      return res.json(employee);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error fetching employee", error: error.message });
    }
  }

  // Create new employee
  async createEmployee(req: Request, res: Response) {
    try {
      const employee = await this.employeeDatabase.create(req.body);
      return res.status(201).json(employee);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error creating employee", error: error.message });
    }
  }

  // Update employee
  async updateEmployee(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const employee = await this.employeeDatabase.findById(id);

      if (!employee) {
        return res.status(404).json({ message: "Employee not found" });
      }

      const updatedEmployee = await this.employeeDatabase.update(id, req.body);
      return res.json(updatedEmployee);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error updating employee", error: error.message });
    }
  }

  // Delete employee
  async deleteEmployee(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const success = await this.employeeDatabase.delete(id);

      if (!success) {
        return res.status(404).json({ message: "Employee not found" });
      }

      return res.status(204).send();
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error deleting employee", error: error.message });
    }
  }
}
