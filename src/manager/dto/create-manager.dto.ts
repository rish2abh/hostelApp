import { IsString, IsEmail, IsEnum, IsOptional, MinLength, IsPhoneNumber } from 'class-validator';
import { UserRole } from '../../entities/user.entity';

export class CreateManagerDto {

  @IsString()
  @MinLength(2)
  firstName: string;

  @IsString()
  @MinLength(2)
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  @IsPhoneNumber()
  @IsOptional()
  phoneNumber?: string;

  @IsOptional()
  assignedRooms?: string[];
} 