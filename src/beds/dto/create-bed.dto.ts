import { IsString, IsNotEmpty, IsEnum, IsOptional, IsMongoId, IsNumber, IsArray } from 'class-validator';
import { BedStatus, BedType } from '../../entities/bed.entity';

export class CreateBedDto {
  @IsString()
  @IsNotEmpty()
  bedNumber: string;

  @IsMongoId()
  @IsNotEmpty()
  roomId: string;

  @IsEnum(BedStatus)
  @IsOptional()
  status?: BedStatus;

  @IsMongoId()
  @IsOptional()
  assignedUser?: string;

  @IsEnum(BedType)
  @IsString()
  @IsOptional()
  type?: string;

  @IsNumber()
  monthlyRent?: string;

  @IsArray()
  @IsString({ each: true }) // Ensures every element in the array is a string
  @IsOptional()
  features?: string[];
} 