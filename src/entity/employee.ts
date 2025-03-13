export class Employee {
    id?: number;
    name: string;
    position: string;
    salary?: number;
    departmentId?: number;
    department?: any; // This will be populated manually when needed
    isActive: boolean = true;
    hireDate: Date = new Date();
}