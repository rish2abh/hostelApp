import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, Schema as MongooseSchema } from 'mongoose';

export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED'
}

export enum PaymentMethod {
  CASH = 'CASH',
  CARD = 'CARD',
  BANK_TRANSFER = 'BANK_TRANSFER',
  UPI = 'UPI',
  OTHER = 'OTHER'
}

@Schema({ timestamps: true })
export class Payment extends Document {
  @ApiProperty({ 
    example: '507f1f77bcf86cd799439011',
    description: 'ID of the user who made the payment',
    type: String
  })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: MongooseSchema.Types.ObjectId;

  @ApiProperty({ 
    example: '507f1f77bcf86cd799439012',
    description: 'ID of the room this payment is for',
    type: String
  })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Room', required: true })
  roomId: MongooseSchema.Types.ObjectId;

  @ApiProperty({ 
    example: 5000,
    description: 'Amount of the payment in the smallest currency unit (e.g., cents)',
    minimum: 0
  })
  @Prop({ required: true, min: 0 })
  amount: number;

  @ApiProperty({ 
    enum: PaymentStatus,
    example: PaymentStatus.COMPLETED,
    description: 'Current status of the payment',
    default: PaymentStatus.PENDING
  })
  @Prop({ type: String, enum: PaymentStatus, default: PaymentStatus.PENDING })
  status: PaymentStatus;

  @ApiProperty({ 
    example: '2024-03-25T10:30:00.000Z',
    description: 'Date when the payment was made',
    required: true
  })
  @Prop({ required: true })
  paymentDate: Date;

  @ApiProperty({ 
    example: 'txn_1234567890',
    description: 'Payment transaction ID from payment processor',
    required: false
  })
  @Prop()
  transactionId?: string;

  @ApiProperty({ 
    enum: PaymentMethod,
    example: PaymentMethod.CARD,
    description: 'Method used for payment',
    required: true
  })
  @Prop({ type: String, enum: PaymentMethod, required: true })
  paymentMethod: PaymentMethod;

  @ApiProperty({ 
    example: 'Rent payment for March 2024',
    description: 'Additional notes about the payment',
    required: false
  })
  @Prop()
  notes?: string;

  @ApiProperty({ 
    example: { invoiceNumber: 'INV-123', month: 'March 2024' },
    description: 'Additional payment metadata',
    required: false
  })
  @Prop({ type: Object })
  metadata?: Record<string, any>;

  @ApiProperty({
    example: '2024-03-25T10:30:00.000Z',
    description: 'Timestamp when the payment was created',
    readOnly: true
  })
  createdAt: Date;

  @ApiProperty({
    example: '2024-03-25T10:30:00.000Z',
    description: 'Timestamp when the payment was last updated',
    readOnly: true
  })
  updatedAt: Date;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment); 