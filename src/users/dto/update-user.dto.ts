import { 
  IsString, IsEmail, IsEnum, IsOptional, MinLength, 
  IsPhoneNumber, IsBoolean, IsArray, IsObject, IsDate, 
  IsNumber 
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '../../entities/user.entity';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'John', description: 'First name of the user' })
  @IsString()
  @MinLength(2)
  @IsOptional()
  firstName?: string;

  @ApiPropertyOptional({ example: 'Doe', description: 'Last name of the user' })
  @IsString()
  @MinLength(2)
  @IsOptional()
  lastName?: string;

  // Uncomment if needed:
  // @ApiPropertyOptional({ example: 'john.doe@example.com', description: 'Email address of the user' })
  // @IsEmail()
  // @IsOptional()
  // email?: string;

  // @ApiPropertyOptional({ example: 'securePass123', description: 'Password for the user account', minLength: 6 })
  // @IsString()
  // @MinLength(6)
  // @IsOptional()
  // password?: string;

  // @ApiPropertyOptional({ enum: UserRole, description: 'Role assigned to the user' })
  // @IsEnum(UserRole)
  // @IsOptional()
  // role?: UserRole;

  @ApiPropertyOptional({ example: true, description: 'Whether the user is active' })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional({ example: '+1234567890', description: 'Phone number of the user' })
  @IsPhoneNumber()
  @IsOptional()
  phoneNumber?: string;

  @ApiPropertyOptional({ example: ['101', '102'], description: 'List of assigned room identifiers' })
  @IsOptional()
  @IsArray()
  assignedRooms?: string[];

  @ApiPropertyOptional({
    description: 'Documents associated with the user',
    example: [
      { type: 'Passport', number: 'A1234567', expiryDate: '2030-01-01' }
    ]
  })
  @IsOptional()
  @IsArray()
  documents?: { type: string; number: string; expiryDate: Date }[];

  @ApiPropertyOptional({
    description: 'Information about the user’s parent',
    example: {
      name: 'Jane Doe',
      phoneNumber: '+1987654321',
      relationship: 'Mother'
    }
  })
  @IsOptional()
  @IsObject()
  parentInfo?: {
    name: string;
    phoneNumber: string;
    relationship: string;
  };

  @ApiPropertyOptional({
    description: 'User’s contact information',
    example: {
      email: 'emergency@example.com',
      address: {
        street: '123 Main St',
        city: 'Springfield',
        state: 'IL',
        country: 'USA',
        postalCode: '62704'
      },
      emergencyContact: {
        name: 'Alice Doe',
        phoneNumber: '+123456789',
        relationship: 'Sister'
      }
    }
  })
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

  @ApiPropertyOptional({
    description: 'User’s professional information',
    example: {
      occupation: 'Software Engineer',
      company: 'TechCorp',
      designation: 'Developer',
      workExperience: '3 years',
      monthlyIncome: 5000,
      employmentType: 'Full-time'
    }
  })
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

  @ApiPropertyOptional({
    description: 'Additional user information',
    example: {
      dateOfBirth: '1990-01-01',
      nationality: 'Indian',
      preferredLanguage: 'English',
      specialRequirements: ['Wheelchair access']
    }
  })
  @IsOptional()
  @IsObject()
  additionalInfo?: {
    dateOfBirth: Date;
    nationality: string;
    preferredLanguage: string;
    specialRequirements: string[];
  };
}
