import * as fs from 'fs';
import * as path from 'path';

// Base directory for all data files
const DATA_DIR = path.join(__dirname, '../../data');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Generic file database class
export class FileDatabase<T extends { id?: number }> {
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
        const parsedData = JSON.parse(fileContent);
        this.data = parsedData.entities || [];
        this.nextId = parsedData.nextId || 1;
      }
    } catch (error) {
      console.error(`Error loading data: ${error.message}`);
      this.data = [];
      this.nextId = 1;
    }
  }

  // Save data to file with pretty formatting
  private saveData(): void {
    try {
      const dataToSave = {
        entities: this.data,
        nextId: this.nextId
      };
      fs.writeFileSync(
        this.filePath, 
        JSON.stringify(dataToSave, null, 2), 
        'utf8'
      );
    } catch (error) {
      console.error(`Error saving data: ${error.message}`);
    }
  }

  // Find all entities
  async findAll(): Promise<T[]> {
    return [...this.data];
  }

  // Find entity by ID
  async findById(id: number): Promise<T | null> {
    return this.data.find(entity => entity.id === id) || null;
  }

  // Find entities by criteria
  async findBy(criteria: Partial<T>): Promise<T[]> {
    return this.data.filter(entity => {
      return Object.entries(criteria).every(([key, value]) => {
        return entity[key] === value;
      });
    });
  }

  // Create new entity
  async create(entityData: Omit<T, 'id'>): Promise<T> {
    const newEntity = {
      ...entityData,
      id: this.nextId++
    } as T;
    
    this.data.push(newEntity);
    this.saveData();
    return { ...newEntity };
  }

  // Update entity
  async update(id: number, entityData: Partial<T>): Promise<T | null> {
    const index = this.data.findIndex(entity => entity.id === id);
    if (index === -1) return null;

    this.data[index] = { ...this.data[index], ...entityData };
    this.saveData();
    return { ...this.data[index] };
  }

  // Delete entity
  async delete(id: number): Promise<boolean> {
    const initialLength = this.data.length;
    this.data = this.data.filter(entity => entity.id !== id);
    
    if (initialLength !== this.data.length) {
      this.saveData();
      return true;
    }
    return false;
  }

  // Find entities with relations (simplified version)
  async findWithRelations(relations: string[] = []): Promise<T[]> {
    // In a real implementation, you would handle relations here
    // For now, we'll just return all entities
    return [...this.data];
  }
} 