import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsEnum, IsDate, IsOptional, IsObject, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { PaymentMethod } from '../../entities/payment.entity';

export class CreatePaymentDto {
  @ApiProperty({
    example: '507f1f77bcf86cd799439011',
    description: 'ID of the user making the payment'
  })
  @IsString()
  userId: string;

  @ApiProperty({
    example: '507f1f77bcf86cd799439012',
    description: 'ID of the room this payment is for'
  })
  @IsString()
  roomId: string;

  @ApiProperty({
    example: 5000,
    description: 'Amount of the payment in the smallest currency unit (e.g., cents)',
    minimum: 0
  })
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiProperty({
    example: '2024-03-25T10:30:00.000Z',
    description: 'Date when the payment was made'
  })
  @Type(() => Date)
  @IsDate()
  paymentDate: Date;

  @ApiProperty({
    enum: PaymentMethod,
    example: PaymentMethod.CARD,
    description: 'Method used for payment'
  })
  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @ApiProperty({
    example: 'Rent payment for March 2024',
    description: 'Additional notes about the payment',
    required: false
  })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty({
    example: { invoiceNumber: 'INV-123', month: 'March 2024' },
    description: 'Additional payment metadata',
    required: false
  })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
} 