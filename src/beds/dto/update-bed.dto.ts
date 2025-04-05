import { ApiProperty, PartialType, OmitType } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { CreateBedDto } from './create-bed.dto';
import { BedStatus } from '../../entities/bed.entity';

export class UpdateBedDto extends PartialType(
  OmitType(CreateBedDto, ['roomId'] as const)
) {
  @ApiProperty({
    enum: BedStatus,
    example: BedStatus.OCCUPIED,
    description: 'Updated status of the bed',
    required: false
  })
  @IsEnum(BedStatus)
  @IsOptional()
  status?: BedStatus;

  @ApiProperty({
    example: '507f1f77bcf86cd799439012',
    description: 'ID of the user to be assigned to this bed',
    required: false
  })
  @IsString()
  @IsOptional()
  currentOccupantId?: string;
} 