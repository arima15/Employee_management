import * as fs from 'fs';
import * as path from 'path';

// Define the data directory
const DATA_DIR = path.join(__dirname, '../data');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Generic file storage class
export class FileStorage<T extends { id?: number }> {
  private filePath: string;
  private data: T[] = [];
  private nextId: number = 1;

  constructor(entityName: string) {
    this.filePath = path.join(DATA_DIR, `${entityName}.json`);
    this.loadData();
  }

  // Load data from file
  private loadData(): void {
    try {
      if (fs.existsSync(this.filePath)) {
        const fileContent = fs.readFileSync(this.filePath, 'utf8');
        this.data = JSON.parse(fileContent);
        
        // Find the highest ID to set nextId
        if (this.data.length > 0) {
          const maxId = Math.max(...this.data.map(item => item.id || 0));
          this.nextId = maxId + 1;
        }
      }
    } catch (error) {
      console.error(`Error loading data from ${this.filePath}:`, error);
      this.data = [];
    }
  }

  // Save data to file
  private saveData(): void {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(this.data, null, 2));
    } catch (error) {
      console.error(`Error saving data to ${this.filePath}:`, error);
    }
  }

  // Find all entities
  async find(options?: { relations?: string[] }): Promise<T[]> {
    return [...this.data];
  }

  // Find one entity by ID
  async findOne(options: { where: { id: number }, relations?: string[] }): Promise<T | null> {
    const entity = this.data.find(item => item.id === options.where.id);
    return entity ? { ...entity } : null;
  }

  // Find one entity by criteria
  async findOneBy(criteria: Partial<T>): Promise<T | null> {
    const entity = this.data.find(item => {
      return Object.entries(criteria).every(([key, value]) => 
        item[key as keyof T] === value
      );
    });
    return entity ? { ...entity } : null;
  }

  // Create a new entity
  create(entityData: Partial<T>): T {
    const newEntity = { ...entityData } as T;
    return newEntity;
  }

  // Save an entity
  async save(entity: T): Promise<T> {
    if (!entity.id) {
      // New entity
      entity.id = this.nextId++;
      this.data.push(entity);
    } else {
      // Update existing entity
      const index = this.data.findIndex(item => item.id === entity.id);
      if (index >= 0) {
        this.data[index] = { ...entity };
      } else {
        this.data.push(entity);
      }
    }
    this.saveData();
    return { ...entity };
  }

  // Merge entity data
  merge(target: T, source: Partial<T>): T {
    return Object.assign(target, source);
  }

  // Remove an entity
  async remove(entity: T): Promise<T> {
    const index = this.data.findIndex(item => item.id === entity.id);
    if (index >= 0) {
      this.data.splice(index, 1);
      this.saveData();
    }
    return entity;
  }
}

// Create repositories for our entities
export const employeeRepository = new FileStorage<any>('employees');
export const departmentRepository = new FileStorage<any>('departments');

// Mock AppDataSource to maintain compatibility
export const FileDataSource = {
  initialize: async () => {
    console.log('File storage initialized');
    return FileDataSource;
  },
  getRepository: (entity: any) => {
    if (entity.name === 'Employee') {
      return employeeRepository;
    } else if (entity.name === 'Department') {
      return departmentRepository;
    }
    throw new Error(`Unknown entity: ${entity.name}`);
  },
  manager: {
    create: (entity: any, data: any) => {
      if (entity.name === 'Employee') {
        return employeeRepository.create(data);
      } else if (entity.name === 'Department') {
        return departmentRepository.create(data);
      }
      throw new Error(`Unknown entity: ${entity.name}`);
    },
    save: async (entity: any) => {
      if ('id' in entity) {
        // It's an entity instance
        if (entity.constructor.name === 'Employee') {
          return employeeRepository.save(entity);
        } else if (entity.constructor.name === 'Department') {
          return departmentRepository.save(entity);
        }
      }
      // It's a repository.create result
      return entity;
    }
  }
}; 