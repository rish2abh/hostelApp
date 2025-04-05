import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateManagerDto } from './create-manager.dto';

import {
  IsString,
  IsEmail,
  IsEnum,
  IsOptional,
  MinLength,
  IsPhoneNumber,
  IsBoolean,
  IsArray,
  IsObject,
} from 'class-validator';
import { managerRole } from 'src/entities/managers.entity';


export class UpdateManagerDto extends PartialType(CreateManagerDto) {
  @ApiPropertyOptional({
    example: 'John',
    description: 'First name of the manager',
  })
  @IsString()
  @MinLength(2)
  @IsOptional()
  firstName?: string;

  @ApiPropertyOptional({
    example: 'Doe',
    description: 'Last name of the manager',
  })
  @IsString()
  @MinLength(2)
  @IsOptional()
  lastName?: string;

  @ApiPropertyOptional({
    example: 'john.doe@example.com',
    description: 'Email address of the manager',
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({
    example: 'securePass123',
    description: 'Password (will be hashed)',
  })
  @IsString()
  @MinLength(6)
  @IsOptional()
  password?: string;

  @ApiPropertyOptional({
    enum: managerRole,
    example: managerRole.USER,
    description: 'Role of the manager',
  })
  @IsEnum(managerRole)
  @IsOptional()
  role?: managerRole;

  @ApiPropertyOptional({
    example: '+1234567890',
    description: 'Phone number of the manager',
  })
  @IsPhoneNumber()
  @IsOptional()
  phoneNumber?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Whether the manager account is active',
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional({
    example: {
      user: true,
      manager: false,
      dashboard: true,
    },
    description: 'Permissions object with module keys and boolean values',
    type: 'object',
    additionalProperties: { type: 'boolean' },
  })
  @IsObject()
  @IsOptional()
  permissions?: Record<string, boolean>;

}
