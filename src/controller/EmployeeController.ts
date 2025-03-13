import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Employee } from "../entity/employee";

export class EmployeeController {
  private employeeRepository = AppDataSource.getRepository(Employee);

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
}
