import "reflect-metadata";
import { DataSource } from "typeorm";
import { Employee } from "./entity/employee";
import { Department } from "./entity/Department";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "arima",
  password: "mamang99",
  database: "eroy",
  synchronize: true,
  logging: false,
  entities: [Employee, Department],
  migrations: [],
  subscribers: [],
});
