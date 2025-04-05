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
  @ApiProperty({
    example: '507f1f77bcf86cd799439011',
    description: 'ID of the room associated with this expense',
    type: String,
    required: false
  })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Room' })
  roomId?: MongooseSchema.Types.ObjectId;

  @ApiProperty({
    example: 15000,
    description: 'Amount of the expense in the smallest currency unit (e.g., cents)',
    minimum: 0,
    required: true
  })
  @Prop({ required: true, min: 0 })
  amount: number;

  @ApiProperty({
    enum: ExpenseCategory,
    example: ExpenseCategory.MAINTENANCE,
    description: 'Category of the expense',
    required: true
  })
  @Prop({ type: String, enum: ExpenseCategory, required: true })
  category: ExpenseCategory;

  @ApiProperty({
    example: 'Monthly maintenance for Room 101',
    description: 'Description of the expense',
    required: true
  })
  @Prop({ required: true })
  description: string;

  @ApiProperty({
    enum: ExpenseStatus,
    example: ExpenseStatus.PENDING,
    description: 'Current status of the expense',
    default: ExpenseStatus.PENDING
  })
  @Prop({ type: String, enum: ExpenseStatus, default: ExpenseStatus.PENDING })
  status: ExpenseStatus;

  @ApiProperty({
    example: '507f1f77bcf86cd799439012',
    description: 'ID of the user who created this expense',
    type: String,
    required: true
  })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  createdBy: MongooseSchema.Types.ObjectId;

  @ApiProperty({
    example: '507f1f77bcf86cd799439013',
    description: 'ID of the user who approved this expense',
    type: String,
    required: false
  })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  approvedBy?: MongooseSchema.Types.ObjectId;

  @ApiProperty({
    example: 'receipt-2024-03-25.pdf',
    description: 'URL or path to the expense receipt',
    required: false
  })
  @Prop()
  receiptUrl?: string;

  @ApiProperty({
    example: '2024-03-25',
    description: 'Date when the expense occurred',
    required: true
  })
  @Prop({ required: true })
  expenseDate: Date;

  @ApiProperty({
    example: { notes: 'Urgent repair required', priority: 'high' },
    description: 'Additional metadata about the expense',
    required: false
  })
  @Prop({ type: Object })
  metadata?: Record<string, any>;

  @ApiProperty({
    example: '2024-03-25T10:30:00.000Z',
    description: 'Timestamp when the expense record was created',
    readOnly: true
  })
  createdAt: Date;

  @ApiProperty({
    example: '2024-03-25T10:30:00.000Z',
    description: 'Timestamp when the expense record was last updated',
    readOnly: true
  })
  updatedAt: Date;
}

export const ExpenseSchema = SchemaFactory.createForClass(Expense); 