import { EmployeeController } from "./controller/EmployeeController"
import { DepartmentController } from "./controller/DepartmentController"
import { Router } from "express"
import { ILike } from "typeorm"

const router = Router()
const employeeController = new EmployeeController()

export const Routes = [{
    method: "get",
    route: "/employees",
    controller: EmployeeController,
    action: "getAllEmployees"
}, {
    method: "get",
    route: "/employees/search",
    controller: EmployeeController,
    action: "searchEmployeesByName"
}, {
    method: "get",
    route: "/employees/:id",
    controller: EmployeeController,
    action: "getEmployeeById"
}, {
    method: "post",
    route: "/employees",
    controller: EmployeeController,
    action: "createEmployee"
}, {
    method: "put",
    route: "/employees/:id",
    controller: EmployeeController,
    action: "updateEmployee"
}, {
    method: "delete",
    route: "/employees/:id",
    controller: EmployeeController,
    action: "deleteEmployee"
}, {
    method: "get",
    route: "/departments",
    controller: DepartmentController,
    action: "getAllDepartments"
}, {
    method: "get",
    route: "/departments/:id",
    controller: DepartmentController,
    action: "getDepartmentById"
}, {
    method: "post",
    route: "/departments",
    controller: DepartmentController,
    action: "createDepartment"
}, {
    method: "put",
    route: "/departments/:id",
    controller: DepartmentController,
    action: "updateDepartment"
}, {
    method: "delete",
    route: "/departments/:id",
    controller: DepartmentController,
    action: "deleteDepartment"
}, {
    method: "post",
    route: "/employees/:id/projects",
    controller: EmployeeController,
    action: "assignToProject"
}, {
    method: "put",
    route: "/employees/:id/salary",
    controller: EmployeeController,
    action: "updateEmployeeSalary"
}]

// Assign employee to a project
router.post("/:id/projects", employeeController.assignToProject)

export default router
