import "reflect-metadata";
import { Employee } from "./entity/employee";
import { Department } from "./entity/Department";
import { FileDataSource } from "./file-storage";

// Export the file-based data source
export const AppDataSource = FileDataSource;
