import { 
  IsString, IsEmail, IsEnum, IsOptional, MinLength, 
  IsPhoneNumber, IsBoolean, IsArray, IsDate, IsObject, 
  IsNumber, IsNotEmpty, 
  IsMongoId
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { UserRole } from '../../entities/user.entity';

export class CreateUserDto {
  @ApiProperty({ example: 'John', description: 'First name of the user' , required: false,
    default: true})
  @IsString()
  @MinLength(2)
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'Last name of the user' })
  @IsString()
  @MinLength(2)
  lastName: string;

  @ApiProperty({ example: 'john.doe@example.com', description: 'Email address of the user' })
  @IsEmail()
  email: string;

  // Uncomment and use if needed:
  // @ApiProperty({ example: 'strongPassword123', description: 'User password', minLength: 6 })
  // @IsString()
  // @MinLength(6)
  // password: string;

  // @ApiPropertyOptional({ enum: UserRole, description: 'Role of the user' })
  // @IsEnum(UserRole)
  // @IsOptional()
  // role?: UserRole;

  @ApiPropertyOptional({ example: true, description: 'Whether the user is active' })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean = true;

  @ApiProperty({ example: '+1234567890', description: 'Phone number of the user' })
  @IsPhoneNumber("IN")
  phoneNumber?: string;

  @ApiProperty({ 
    example: '101', 
    description: 'List of assigned room identifiers' 
  })
  @IsString()
  @IsMongoId()
  assignedRooms?: MongooseSchema.Types.ObjectId;


  @ApiProperty({ 
    example: '56546546545644', 
    description: 'List of assigned bed identifiers' 
  })
  @IsMongoId()
  assignedBed?:  MongooseSchema.Types.ObjectId;

  @ApiPropertyOptional({
    description: 'List of user documents',
    example: [
      { type: 'Passport', number: 'A1234567', expiryDate: '2030-01-01' }
    ]
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  documents?: string[];

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
    description: 'Additional personal info',
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
