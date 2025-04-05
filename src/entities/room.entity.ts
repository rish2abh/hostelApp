import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class Room extends Document {
  @ApiProperty({ example: '101', description: 'Room number identifier' })
  @Prop({ required: true })
  roomNumber: string;

  @ApiProperty({ example: 1, description: 'Floor number where the room is located', minimum: 0 })
  @Prop({ required: true })
  floor: number;

  @ApiProperty({ example: 2, description: 'Maximum number of occupants allowed', minimum: 1 })
  @Prop({ required: true })
  capacity: number;


  @ApiProperty({ 
    example: ['http://example.com/image1.jpg'], 
    description: 'Array of room image URLs',
    isArray: true,
    required: false
  })
  @Prop({ type: [String] })
  images: string[];

  @ApiProperty({ example: 'Spacious room with balcony', description: 'Detailed description of the room' })
  @Prop({ required: false })
  description: string;


  @ApiProperty({ 
    example: false, 
    description: 'Indicates if the room is currently occupied'
  })
  @Prop({ default: false })
  isOccupied: boolean;

  @ApiProperty({ 
    example: true, 
    description: 'Indicates if the room is active and available for booking',
    default: true
  })
  @Prop({ default: true })
  isActive: boolean;

  @ApiProperty({
    example: '2024-03-25T10:30:00.000Z',
    description: 'Timestamp when the room was created',
    readOnly: true
  })
  createdAt: Date;

  @ApiProperty({
    example: '2024-03-25T10:30:00.000Z',
    description: 'Timestamp when the room was last updated',
    readOnly: true
  })
  updatedAt: Date;
}

export const RoomSchema = SchemaFactory.createForClass(Room); 