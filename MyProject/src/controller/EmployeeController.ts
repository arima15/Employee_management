import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { Employee } from './employee.entity';

@Controller('employees')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post()
  async create(@Body() createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
    return this.employeeService.create(createEmployeeDto);
  }

  @Get()
  async findAll(): Promise<Employee[]> {
    return this.employeeService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Employee> {
    return this.employeeService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updateEmployeeDto: UpdateEmployeeDto): Promise<Employee> {
    return this.employeeService.update(id, updateEmployeeDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.employeeService.remove(id);
  }
}
