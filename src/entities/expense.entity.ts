import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, Schema as MongooseSchema } from 'mongoose';

export enum ExpenseCategory {
  MAINTENANCE = 'MAINTENANCE',
  UTILITIES = 'UTILITIES',
  SUPPLIES = 'SUPPLIES',
  REPAIRS = 'REPAIRS',
  CLEANING = 'CLEANING',
  SECURITY = 'SECURITY',
  OTHER = 'OTHER'
}

export enum ExpenseStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  PAID = 'PAID'
}

@Schema({ timestamps: true })
export class Expense extends Document {
  @ApiProperty({ example: 15000, minimum: 0, required: true })
  @Prop({ required: true, min: 0 })
  amount: number;

  @ApiProperty({ enum: ExpenseCategory, example: ExpenseCategory.MAINTENANCE })
  @Prop({ type: String, enum: ExpenseCategory, required: true })
  category: ExpenseCategory;

  @ApiProperty({ example: 'Monthly maintenance for Room 101' })
  @Prop({ required: true })
  description: string;

  @ApiProperty({ example: '2024-03-25' })
  @Prop({ required: true })
  expenseDate: Date;

  @ApiProperty({ example: 'Cash / UPI / Bank Transfer' })
  @Prop({ required: true })
  paymentMethod: string;

  @ApiProperty({ example: 'RCPT123456' })
  @Prop()
  receiptNumber?: string;

  @ApiProperty({ example: 'Rishabh' })
  @Prop({ required: true })
  paidTo: string;

  @ApiProperty({ example: 'This was paid in cash at the gate.' })
  @Prop()
  notes?: string;

  @ApiProperty({ example: ['file1.pdf', 'file2.jpg'], description: 'Array of attachment paths or URLs' })
  @Prop({ type: [String], default: [] })
  attachments?: string[];

  @ApiProperty({ enum: ExpenseStatus, default: ExpenseStatus.PENDING })
  @Prop({ type: String, enum: ExpenseStatus, default: ExpenseStatus.PENDING })
  status: ExpenseStatus;

  @ApiProperty({ readOnly: true })
  createdAt: Date;

  @ApiProperty({ readOnly: true })
  updatedAt: Date;
}

export const ExpenseSchema = SchemaFactory.createForClass(Expense);
