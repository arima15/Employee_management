import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm"
import { Employee } from "./employee"

@Entity()
export class Department {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @OneToMany(() => Employee, employee => employee.department)
    employees: Employee[];
}
