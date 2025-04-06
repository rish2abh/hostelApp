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
    const data = this.expnseModel.aggregate([
      {
        $lookup: {
          from: 'managers',
          localField: 'paidby',
          foreignField: '_id',
          as: 'paidByInfo'
        }
      },
      {
        $unwind: {
          path: '$paidByInfo',
          preserveNullAndEmptyArrays: true // Optional: if you want to keep expenses even if manager not found
        }
      },
      {
        $addFields: {
          paidByName: {
            $concat: [
              { $ifNull: ['$paidByInfo.firstName', ''] },
              ' ',
              { $ifNull: ['$paidByInfo.lastName', ''] }
            ]
          }
        }
      },
      {
        $project: {
          paidByInfo: 0 // Exclude full manager object if not needed
        }
      }
    ]);
    
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
