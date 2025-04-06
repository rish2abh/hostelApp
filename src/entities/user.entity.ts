import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, Schema as MongooseSchema } from 'mongoose';

export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  USER = 'USER',
}

@Schema({ timestamps: true })
export class User extends Document {
  @ApiProperty({ 
    example: 'John',
    description: 'First name of the user'
  })
  @Prop({ required: true })
  firstName: string;

  @ApiProperty({ 
    example: 'Doe',
    description: 'Last name of the user'
  })
  @Prop({ required: true })
  lastName: string;

  @ApiProperty({ 
    example: 'john.doe@example.com',
    description: 'Email address of the user',
    uniqueItems: true
  })
  @Prop({ required: true, unique: true })
  email: string;

  // @ApiProperty({ 
  //   example: 'hashedPassword123',
  //   description: 'Hashed password of the user',
  //   writeOnly: true
  // })
  // @Prop({ required: true })
  // password: string;

  // @ApiProperty({ 
  //   enum: UserRole,
  //   example: UserRole.USER,
  //   description: 'Role of the user in the system',
  //   default: UserRole.USER
  // })
  // @Prop({ type: String, enum: UserRole, default: UserRole.USER })
  // role: UserRole;

  @ApiProperty({ 
    example: true,
    description: 'Whether the user account is active',
    default: true
  })
  @Prop({ default: true })
  isActive: boolean;

  @ApiProperty({ 
    example: '+1234567890',
    description: 'Contact phone number of the user',
    required: true
  })
  @Prop({required: true})
  phoneNumber?: string;

  @ApiProperty({ 
    example: '507f1f77bcf86cd799439011',
    description: 'Array of room IDs assigned to this user',
    type: String,
    required: false
  })
  @Prop({ type: MongooseSchema.Types.ObjectId } )
  assignedRooms: MongooseSchema.Types.ObjectId;

  @ApiProperty({ 
    example: '507f1f77bcf86cd799439011',
    description: 'Array of Bed IDs assigned to this user',
    type: String,
    required: false
  })
  @Prop( {type: MongooseSchema.Types.ObjectId })
  assignedBed: MongooseSchema.Types.ObjectId;

  @ApiProperty({
    example: '2024-03-25T10:30:00.000Z',
    description: 'Timestamp when the user was created',
    readOnly: true
  })
  createdAt: Date;

  @ApiProperty({
    example: '2024-03-25T10:30:00.000Z',
    description: 'Timestamp when the user was last updated',
    readOnly: true
  })
  updatedAt: Date;

  // Additional fields

  @ApiProperty({
    example: [
      {
        type: 'Passport',
        number: '456',
        expiryDate: '2025-04-09T18:30:00.000Z'
      }
    ],
    description: 'Array of documents associated with the user',
    isArray: true
  })
  @Prop([
    {
      type: {
        type: String,
        required: true
      },
      number: {
        type: String,
        required: true
      },
      expiryDate: {
        type: Date,
        required: true
      }
    }
  ])
  documents: { type: string; number: string; expiryDate: Date }[];

  @ApiProperty({
    example: {
      name: 'RAM NN',
      phoneNumber: '9630793549',
      relationship: 'Father'
    },
    description: 'Parent information of the user',
  })
  @Prop({
    type: {
      name: String,
      phoneNumber: String,
      relationship: String,
    },
  })
  parentInfo: {
    name: string;
    phoneNumber: string;
    relationship: string;
  };

  @ApiProperty({
    example: {
      email: 'BHUSHAN@GMAIL.COM',
      address: {
        street: '345',
        city: '454',
        state: '54',
        country: '45',
        postalCode: '5',
      },
      emergencyContact: {
        name: '45',
        phoneNumber: '9630793549',
        relationship: 'Friend',
      },
    },
    description: 'Contact information of the user',
  })
  @Prop({
    type: {
      email: String,
      address: {
        street: String,
        city: String,
        state: String,
        country: String,
        postalCode: String,
      },
      emergencyContact: {
        name: String,
        phoneNumber: String,
        relationship: String,
      },
    },
  })
  contactInfo: {
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

  @ApiProperty({
    example: {
      occupation: 'Software Developer',
      company: 'Tech Inc.',
      designation: 'Senior Developer',
      workExperience: '5 years',
      monthlyIncome: 5000,
      employmentType: 'Full Time',
    },
    description: 'Professional information of the user',
  })
  @Prop({
    type: {
      occupation: String,
      company: String,
      designation: String,
      workExperience: String,
      monthlyIncome: Number,
      employmentType: String,
    },
  })
  professionalInfo: {
    occupation: string;
    company: string;
    designation: string;
    workExperience: string;
    monthlyIncome: number;
    employmentType: string;
  };

  @ApiProperty({
    example: {
      dateOfBirth: '2025-04-03T18:30:00.000Z',
      nationality: 'Indian',
      preferredLanguage: 'English',
      specialRequirements: ['Wheelchair access'],
    },
    description: 'Additional information about the user',
  })
  @Prop({
    type: {
      dateOfBirth: Date,
      nationality: String,
      preferredLanguage: String,
      specialRequirements: [String],
    },
  })
  additionalInfo: {
    dateOfBirth: Date;
    nationality: string;
    preferredLanguage: string;
    specialRequirements: string[];
  };
}

export const UserSchema = SchemaFactory.createForClass(User);
