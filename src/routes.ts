


import { EmployeeController } from "./controller/EmployeeController"
import { DepartmentController } from "./controller/DepartmentController"
import { Router } from "express"
import { ILike } from "typeorm"
import { ProductController } from "./controller/productController"


const router = Router()
const employeeController = new EmployeeController()
const productController = new ProductController()

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
    method: "get",
    route: "/products",
    controller: ProductController,
    action: "getAllProducts"
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
}, {
    method: "get",
    route: "/employees/:id/tenure",
    controller: EmployeeController,
    action: "getEmployeeTenure"
}, {
    method: "get",
    route: "/tasks",
    controller: EmployeeController,
    action: "printTasks"
}, ]

// Assign employee to a project
router.post("/:id/projects", employeeController.assignToProject)

export default router
