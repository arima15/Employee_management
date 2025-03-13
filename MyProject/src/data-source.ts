import "reflect-metadata"
import { DataSource } from "typeorm"
import { Employee } from "./entity/employee"
import { Department } from "./entity/Department"

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3307,
    username: "root",
    password: "08272003",
    database: "Cherie",
    synchronize: true,
    logging: false,
    entities: [Employee, Department],
    migrations: [],
    subscribers: [],
})
