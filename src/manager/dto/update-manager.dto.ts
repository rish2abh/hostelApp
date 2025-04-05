import { PartialType } from '@nestjs/swagger';
import { CreateManagerDto } from './create-manager.dto';

import { IsString, IsEmail, IsEnum, IsOptional, MinLength, IsPhoneNumber, IsBoolean } from 'class-validator';
import { UserRole } from '../../entities/user.entity';

export class UpdateManagerDto extends PartialType(CreateManagerDto) {
  @IsString()
  @MinLength(2)
  @IsOptional()
  firstName?: string;

  @IsString()
  @MinLength(2)
  @IsOptional()
  lastName?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @MinLength(6)
  @IsOptional()
  password?: string;

  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  @IsPhoneNumber()
  @IsOptional()
  phoneNumber?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsOptional()
  assignedRooms?: string[];
} 