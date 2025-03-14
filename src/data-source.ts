import "reflect-metadata";
import { DataSource } from "typeorm";
import { Employee } from "./entity/employee";
import { Department } from "./entity/Department";
import { Project } from "./entity/Project";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: "root",
  database: "eroy",
  synchronize: true,
  logging: false,
  entities: [Employee, Department, Project],
  migrations: [],
  subscribers: [],
});
