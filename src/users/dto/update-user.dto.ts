import { IsString, IsEmail, IsEnum, IsOptional, MinLength, IsPhoneNumber, IsBoolean, IsArray, IsObject, IsDate, IsNumber } from 'class-validator';
import { UserRole } from '../../entities/user.entity';

// DTO for updating a user
export class UpdateUserDto {
  @IsString()
  @MinLength(2)
  @IsOptional()
  firstName?: string;

  @IsString()
  @MinLength(2)
  @IsOptional()
  lastName?: string;

  // @IsEmail()
  // @IsOptional()
  // email?: string;

  // @IsString()
  // @MinLength(6)
  // @IsOptional()
  // password?: string;

  // @IsEnum(UserRole)
  // @IsOptional()
  // role?: UserRole;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsPhoneNumber()
  @IsOptional()
  phoneNumber?: string;

  @IsOptional()
  @IsArray()
  assignedRooms?: string[];

  @IsOptional()
  @IsArray()
  documents?: { type: string; number: string; expiryDate: Date }[];

  @IsOptional()
  @IsObject()
  parentInfo?: {
    name: string;
    phoneNumber: string;
    relationship: string;
  };

  @IsOptional()
  @IsObject()
  contactInfo?: {
    email: string;
    address: {
      street: string;
      city: string;
      state: string;
      country: string;
      postalCode: string;
    };
    emergencyContact: {
      name: string;
      phoneNumber: string;
      relationship: string;
    };
  };

  @IsOptional()
  @IsObject()
  professionalInfo?: {
    occupation: string;
    company: string;
    designation: string;
    workExperience: string;
    monthlyIncome: number;
    employmentType: string;
  };

  @IsOptional()
  @IsObject()
  additionalInfo?: {
    dateOfBirth: Date;
    nationality: string;
    preferredLanguage: string;
    specialRequirements: string[];
  };
}
