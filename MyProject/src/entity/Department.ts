import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"


@Entity()
export class Department {
    @PrimaryGeneratedColumn()
id: number;
@Column()
name: string;
@OneToMany(() => Employee, (employee) => employee.department)
employees: Employee [];
}
