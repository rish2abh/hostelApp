import { Injectable } from '@nestjs/common';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { Expense } from 'src/entities/expense.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ExpenseService {
    constructor(
      @InjectModel(Expense.name) private expnseModel: Model<Expense>,
    ) {}

  create(createExpenseDto: CreateExpenseDto) {
    try {
      const createdPayment = new this.expnseModel(createExpenseDto)    
      return createdPayment.save();
  } catch (error) {
      console.log(error.message);
      throw error   
  }
  }

  findAll() {
    const data = this.expnseModel.find()
    return data 
  }

  findOne(id: number) {
    return `This action returns a #${id} expense`;
  }

  update(id: number, updateExpenseDto: UpdateExpenseDto) {
    return `This action updates a #${id} expense`;
  }

  remove(id: number) {
    return `This action removes a #${id} expense`;
  }
}
