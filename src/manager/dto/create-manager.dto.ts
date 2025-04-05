import { IsString, IsEmail, IsEnum, IsOptional, MinLength, IsPhoneNumber, IsArray, IsNotEmpty, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { managerRole } from 'src/entities/managers.entity';

export class CreateManagerDto {

  @ApiProperty({ example: 'Rishabh', minLength: 2 })
  @IsString()
  @MinLength(2)
  firstName: string;

  @ApiProperty({ example: 'Shrivastava', minLength: 2 })
  @IsString()
  @MinLength(2)
  lastName: string;

  @ApiProperty({ example: 'rishabh@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'securePass123', minLength: 6 })
  @IsString()
  @MinLength(6)
  password: string;

 
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
  permissions?: Record<string, boolean>;



  @ApiPropertyOptional({ enum: managerRole, example: managerRole.SUPER_ADMIN })
  @IsEnum(managerRole)
  @IsOptional()
  role?: managerRole;

  @ApiPropertyOptional({ example: '+919876543210' })
  @IsPhoneNumber()
  @IsOptional()
  phoneNumber?: string;
}

export class LoginDto {

  @ApiProperty({ example: 'rishabh@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'securePass123', minLength: 6 })
  @IsString()
  @IsNotEmpty()
  password: string;

}

