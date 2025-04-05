import { IsString, IsNumber, IsArray, IsOptional, Min, IsBoolean, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsRoomNumberUnique } from './custom-validator';

export class CreateRoomDto {
    

  @ApiProperty({
    example: '101',
    description: 'Room number identifier',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  @IsRoomNumberUnique()
  roomNumber: string;

  @ApiProperty({
    example: 1,
    description: 'Floor number where the room is located',
    minimum: 0,
    required: true
  })
  @IsNumber()
  @Min(0)
  floor: number;

  @ApiProperty({
    example: 2,
    description: 'Maximum number of occupants allowed',
    minimum: 1,
    required: true
  })
  @IsNumber()
  @Min(1)
  capacity: number;

  @ApiProperty({
    example: 5000,
    description: 'Monthly rent amount',
    minimum: 0,
    required: true
  })
  @IsNumber()
  @Min(0)
  rent: number;

  @ApiProperty({
    example: ['http://example.com/image1.jpg', 'http://example.com/image2.jpg'],
    description: 'Array of room image URLs',
    required: false,
    isArray: true,
    type: [String]
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];

  @ApiProperty({
    example: 'Spacious room with balcony and attached bathroom',
    description: 'Detailed description of the room',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    example: true,
    description: 'Whether the room is active and available for booking',
    required: false,
    default: true
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
} 