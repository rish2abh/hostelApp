import { ApiProperty, PartialType, OmitType } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { CreatePaymentDto } from './create-payment.dto';
import { PaymentStatus } from '../../entities/payment.entity';

export class UpdatePaymentDto extends PartialType(
  OmitType(CreatePaymentDto, ['userId', 'roomId'] as const)
) {
  @ApiProperty({
    enum: PaymentStatus,
    example: PaymentStatus.COMPLETED,
    description: 'Updated status of the payment',
    required: false
  })
  @IsEnum(PaymentStatus)
  @IsOptional()
  status?: PaymentStatus;
} 