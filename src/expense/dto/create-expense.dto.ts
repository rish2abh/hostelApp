import {
    IsEnum,
    IsMongoId,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    IsDateString,
    Min,
    IsArray
  } from 'class-validator';
  import { ApiProperty } from '@nestjs/swagger';
import { ExpenseCategory, ExpenseStatus } from 'src/entities/expense.entity';
  
  export class CreateExpenseDto {
    @ApiProperty({ example: 15000, description: 'Amount in smallest currency unit', minimum: 0 })
    @IsNumber()
    @Min(0)
    amount: number;
  
    @ApiProperty({ enum: ExpenseCategory, example: ExpenseCategory.MAINTENANCE, description: 'Category of the expense' })
    @IsEnum(ExpenseCategory)
    category: ExpenseCategory;
  
    @ApiProperty({ example: 'Monthly maintenance for Room 101', description: 'Description of the expense' })
    @IsString()
    @IsNotEmpty()
    description: string;
  
    @ApiProperty({ example: '2024-03-25', description: 'Date of the expense in YYYY-MM-DD format' })
    @IsDateString()
    expenseDate: Date;
  
    @ApiProperty({ example: 'UPI', description: 'Mode of payment (Cash, UPI, Bank Transfer)' })
    @IsString()
    @IsNotEmpty()
    paymentMethod: string;
  
    @ApiProperty({ example: 'RCPT123456', description: 'Optional receipt number', required: false })
    @IsOptional()
    @IsString()
    receiptNumber?: string;
  
    @ApiProperty({ example: 'Rishabh', description: 'Name of the person the payment was made to' })
    @IsString()
    @IsNotEmpty()
    paidTo: string;
  
    @ApiProperty({ example: 'This was paid in cash at the gate.', required: false })
    @IsOptional()
    @IsString()
    notes?: string;
  
    @ApiProperty({ example: '660ff450f5eeb88e8b5ea3e2', description: 'User ID who collected the payment' })
    @IsMongoId()
    @IsOptional()
    paidby: string;
  
    @ApiProperty({ enum: ExpenseStatus, default: ExpenseStatus.PENDING, description: 'Status of the expense' })
    @IsOptional()
    @IsEnum(ExpenseStatus)
    status?: ExpenseStatus;
  }
  