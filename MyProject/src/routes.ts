import { EmployeeController } from "./controller/EmployeeController"

export const Routes = [{
    method: "get",
    route: "/employees",
    controller: EmployeeController,
    action: "getAllEmployees"
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
}]