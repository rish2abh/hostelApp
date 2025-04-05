import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
}

@Schema()
export class Collection {
  @ApiProperty({ example: 'Rent', description: 'Type of the payment' })
  @Prop({ required: true })
  type: string;

  @ApiProperty({ example: 5000, description: 'Amount for the payment', minimum: 0 })
  @Prop({ required: true, min: 0 })
  amount: number;
}

export const CollectionSchema = SchemaFactory.createForClass(Collection);

@Schema({ timestamps: true, collection: 'payment' }) // 👈 Ensures MongoDB collection name is "payment"
export class Payment extends Document {
  @ApiProperty({ type: [Collection] })
  @Prop({ type: [CollectionSchema], required: true })
  collectionItems: Collection[];

  @ApiProperty({ example: 'UPI / Cash / Card' })
  @Prop({ required: true })
  paymentMethod: string;

  @ApiProperty({ enum: PaymentStatus, default: PaymentStatus.COMPLETED })
  @Prop({ type: String, enum: PaymentStatus, default: PaymentStatus.COMPLETED })
  status: PaymentStatus;

  @ApiProperty({ example: '2024-04-01', description: 'Payment date' })
  @Prop({ required: true })
  date: Date;

  @ApiProperty({ example: '2024-04-10', description: 'Due date' })
  @Prop()
  dueDate?: Date;

  @ApiProperty({ example: 'BILL123456' })
  @Prop()
  billNumber?: string;

  @ApiProperty({ example: 'Monthly rent for April' })
  @Prop({ required: true })
  description: string;

  @ApiProperty({ type: String, example: '507f1f77bcf86cd799439012' })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  collectedBy: Types.ObjectId;

  @ApiProperty({ type: String, example: '507f1f77bcf86cd799439013' })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  collectedFrom: Types.ObjectId;

  @ApiProperty({ example: '2024-04-01', description: 'Period start date' })
  @Prop()
  periodStart?: Date;

  @ApiProperty({ example: '2024-04-30', description: 'Period end date' })
  @Prop()
  periodEnd?: Date;

  @ApiProperty({ example: 'Some internal notes' })
  @Prop()
  notes?: string;


  @ApiProperty({ readOnly: true })
  createdAt: Date;

  @ApiProperty({ readOnly: true })
  updatedAt: Date;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
