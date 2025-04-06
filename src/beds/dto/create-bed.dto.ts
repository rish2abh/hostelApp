import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsMongoId,
  IsNumber,
  IsArray,
  ValidateIf,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BedStatus, BedType } from '../../entities/bed.entity';

export class CreateBedDto {
  @ApiProperty({
    example: 'B1',
    description: 'Unique identifier for the bed within the room',
  })
  @IsString()
  @IsNotEmpty()
  bedNumber: string;

  @ApiProperty({
    example: '66212d0f6f57a2a1b28d4eaa',
    description: 'Mongo ID reference to the room this bed belongs to',
  })
  @IsMongoId()
  @IsNotEmpty()
  roomId: string;

  @ApiPropertyOptional({
    enum: BedStatus,
    example: BedStatus.AVAILABLE,
    description: 'Current status of the bed',
  })
  @IsEnum(BedStatus)
  @IsOptional()
  status?: BedStatus;

  @ApiPropertyOptional({
    example: '66212d0f6f57a2a1b28d4eaa',
    description: 'Mongo ID of the user assigned to this bed',
  })
  // @ValidateIf((obj) => obj.assignedUser !== '')
  @IsMongoId()
  @IsOptional()
  assignedUser?: string;

  @ApiPropertyOptional({
    enum: BedType,
    example: BedType.SINGLE,
    description: 'Type of the bed (e.g., single, double)',
  })
  @IsEnum(BedType)
  @IsOptional()
  type?: BedType;

  @ApiPropertyOptional({
    example: 5000,
    description: 'Monthly rent amount for the bed',
  })
  @IsNumber()
  @IsOptional()
  monthlyRent?: number;

  @ApiPropertyOptional({
    example: ['fan', 'table', 'lamp'],
    description: 'List of features available with the bed',
    isArray: true,
    type: String,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  features?: string[];
}
