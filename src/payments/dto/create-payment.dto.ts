import {
  IsArray,
  IsDateString,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
  Min,
  IsNumber
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaymentStatus } from 'src/entities/payment.entity';


class PaymentItemDto {
  @ApiProperty({ example: 'Rent', description: 'Type of the payment item' })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({ example: 5000, description: 'Amount for this payment item', minimum: 0 })
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiPropertyOptional({ example: 5000, description: 'Amount for this payment item',required : false })
  @IsNumber()
  @IsOptional()
  oldUnits?: number;

  @ApiPropertyOptional({ example: 5000, description: 'Amount for this payment item', required : false })
  @IsNumber()
  @IsOptional()
  newUnits?: number;
}

export class CreatePaymentDto {
  @ApiProperty({
    type: [PaymentItemDto],
    description: 'List of items included in the payment'
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PaymentItemDto)
  collectionItems: PaymentItemDto[];

  @ApiProperty({ example: 'UPI', description: 'Payment method used' })
  @IsString()
  @IsNotEmpty()
  paymentMethod: string;

  @ApiProperty({ enum: PaymentStatus, default: PaymentStatus.COMPLETED })
  @IsEnum(PaymentStatus)
  status: PaymentStatus;

  @ApiProperty({ example: '2024-04-01', description: 'Date of payment' })
  @IsDateString()
  date: string;

  @ApiProperty({ example: '2024-04-10', required: false })
  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @ApiProperty({ example: 'BILL-00123', required: false })
  @IsOptional()
  @IsString()
  billNumber?: string;

  @ApiProperty({ example: 'Monthly rent for April', description: 'Purpose of payment' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: '660ff450f5eeb88e8b5ea3e2', description: 'User ID who collected the payment' })
  @IsMongoId()
  collectedBy: string;

  @ApiProperty({ example: '660ff450f5eeb88e8b5ea3e4', description: 'User ID from whom payment was collected' })
  @IsMongoId()
  collectedFrom: string;

  @ApiProperty({ example: '2024-04-01', required: false })
  @IsOptional()
  @IsDateString()
  periodStart?: string;

  @ApiProperty({ example: '2024-04-30', required: false })
  @IsOptional()
  @IsDateString()
  periodEnd?: string;

  @ApiProperty({ example: 'Payment collected late', required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}
