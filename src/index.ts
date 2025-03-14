import * as express from "express"
import * as bodyParser from "body-parser"
import { Request, Response } from "express"
import { AppDataSource } from "./data-source"
import { Routes } from "./routes"
import { Employee } from "./entity/employee"
import * as cors from "cors"
import { Project } from "./entity/Project"

AppDataSource.initialize().then(async () => {

    // create express app
    const app = express()

    // Add CORS middleware
    app.use(cors())
    
    // Configure body parser
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: true }))

    // register express routes from defined application routes
    Routes.forEach(route => {
        (app as any)[route.method](route.route, (req: Request, res: Response, next: Function) => {
            const result = (new (route.controller as any))[route.action](req, res, next)
            if (result instanceof Promise) {
                result.catch(err => {
                    console.error("Unhandled error in route handler:", err);
                    if (!res.headersSent) {
                        res.status(500).json({ message: "Internal server error" });
                    }
                });
            }
        })
    })

    // setup express app here
    // ...

    // start express server
    app.listen(3000)

    // insert new employees for test
    await AppDataSource.manager.save(
        AppDataSource.manager.create(Employee, {
            name: "Timber Saw",
            position: "Lumberjack",
            salary: 50000,
            hireDate: new Date(),
            isActive: true
        })
    )

    await AppDataSource.manager.save(
        AppDataSource.manager.create(Employee, {
            name: "Phantom Assassin",
            position: "Assassin",
            salary: 60000,
            hireDate: new Date(),
            isActive: true
        })
    )

    await AppDataSource.manager.save(
        AppDataSource.manager.create(Project, {
            name: "Website Redesign"
        })
    )

    await AppDataSource.manager.save(
        AppDataSource.manager.create(Project, {
            name: "Mobile App Development"
        })
    )

    console.log("Express server has started on port 3000. Open http://localhost:3000/employees to see results")

}).catch(error => console.log(error))
