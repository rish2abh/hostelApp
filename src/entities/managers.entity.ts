import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, Schema as MongooseSchema } from 'mongoose';

export enum managerRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  USER = 'USER',
}

@Schema({ timestamps: true })
export class Manager extends Document {
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

  @ApiProperty({ 
    example: 'hashedPassword123',
    description: 'Hashed password of the user',
    writeOnly: true
  })
  @Prop({ required: true })
  password: string;

  @ApiProperty({ 
    enum: managerRole,
    example: managerRole.USER,
    description: 'Role of the user in the system',
    default: managerRole.USER
  })
  @Prop({ type: String, enum: managerRole, default: managerRole.USER })
  role: managerRole;

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
    required: false
  })
  @Prop()
  phoneNumber?: string;

  @Prop({ type: Map, of: Boolean, default: {} })
  @ApiProperty({
    example: {
      user: true,
      manager: false,
      dashboard: true,
    },
    description: 'Object where keys represent permissions/modules and values are boolean flags',
    type: 'object',
    additionalProperties: { type: 'boolean' }
  })
  permissions: Record<string, boolean>;
  


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
}

export const ManagerSchema = SchemaFactory.createForClass(Manager); 