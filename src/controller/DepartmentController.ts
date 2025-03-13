import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Department } from "../entity/Department";

export class DepartmentController {
    private departmentRepository = AppDataSource.getRepository(Department);

    // Get all departments
    async getAllDepartments(req: Request, res: Response) {
        try {
            const departments = await this.departmentRepository.find({
                relations: ["employees"]
            });
            return res.json(departments);
        } catch (error) {
            return res.status(500).json({ message: "Error fetching departments", error });
        }
    }

    // Get department by ID
    async getDepartmentById(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const department = await this.departmentRepository.findOne({
                where: { id },
                relations: ["employees"]
            });

            if (!department) {
                return res.status(404).json({ message: "Department not found" });
            }
            return res.json(department);
        } catch (error) {
            return res.status(500).json({ message: "Error fetching department", error });
        }
    }

    // Create new department
    async createDepartment(req: Request, res: Response) {
        try {
            const { name } = req.body;
            const department = new Department();
            department.name = name;

            await this.departmentRepository.save(department);
            return res.status(201).json(department);
        } catch (error) {
            return res.status(500).json({ message: "Error creating department", error });
        }
    }

    // Update department
    async updateDepartment(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const { name } = req.body;

            const department = await this.departmentRepository.findOneBy({ id });
            if (!department) {
                return res.status(404).json({ message: "Department not found" });
            }

            department.name = name;
            await this.departmentRepository.save(department);
            return res.json(department);
        } catch (error) {
            return res.status(500).json({ message: "Error updating department", error });
        }
    }

    // Delete department
    async deleteDepartment(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const department = await this.departmentRepository.findOneBy({ id });

            if (!department) {
                return res.status(404).json({ message: "Department not found" });
            }

            await this.departmentRepository.remove(department);
            return res.status(200).json({ message: "Department deleted successfully" });
        } catch (error) {
            return res.status(500).json({ message: "Error deleting department", error });
        }
    }
}