import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, Schema as MongooseSchema } from 'mongoose';

export enum BedType {
  SINGLE = 'SINGLE',
  DOUBLE = 'DOUBLE',
  BUNK = 'BUNK'
}

export enum BedStatus {
  AVAILABLE = 'AVAILABLE',
  OCCUPIED = 'OCCUPIED',
  MAINTENANCE = 'MAINTENANCE',
  RESERVED = 'RESERVED',
  ALL = "ALL"
}

@Schema({ timestamps: true })
export class Bed extends Document {
  @ApiProperty({
    example: '507f1f77bcf86cd799439011',
    description: 'ID of the room this bed belongs to',
    type: String
  })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Room', required: true })
  roomId: MongooseSchema.Types.ObjectId;

  @ApiProperty({
    example: 'B101',
    description: 'Unique identifier for the bed within the room',
    required: true
  })
  @Prop({ required: true })
  bedNumber: string;

  @ApiProperty({
    enum: BedType,
    example: BedType.SINGLE,
    description: 'Type of bed',
    required: true
  })
  @Prop({ type: String, enum: BedType, required: true })
  type: BedType;

  @ApiProperty({
    enum: BedStatus,
    example: BedStatus.AVAILABLE,
    description: 'Current status of the bed',
    default: BedStatus.AVAILABLE
  })
  @Prop({ type: String, enum: BedStatus, default: BedStatus.AVAILABLE })
  status: BedStatus;

  @ApiProperty({
    example: '507f1f77bcf86cd799439012',
    description: 'ID of the user currently assigned to this bed',
    type: String,
    required: false
  })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  currentOccupantId?: MongooseSchema.Types.ObjectId;

  @ApiProperty({
    example: 5000,
    description: 'Monthly rent amount for this bed in the smallest currency unit (e.g., cents)',
    minimum: 0
  })
  @Prop({ required: true, min: 0 })
  monthlyRent: number;

  @ApiProperty({
    example: ['Window view', 'Power outlet', 'Reading lamp'],
    description: 'List of features or amenities associated with this bed',
    required: false
  })
  @Prop([String])
  features?: string[];

  @ApiProperty({
    example: { lastMaintenance: '2024-03-25', nextMaintenance: '2024-04-25' },
    description: 'Additional metadata about the bed',
    required: false
  })
  @Prop({ type: Object })
  metadata?: Record<string, any>;

  @ApiProperty({
    example: '2024-03-25T10:30:00.000Z',
    description: 'Timestamp when the bed record was created',
    readOnly: true
  })
  createdAt: Date;

  @ApiProperty({
    example: '2024-03-25T10:30:00.000Z',
    description: 'Timestamp when the bed record was last updated',
    readOnly: true
  })
  updatedAt: Date;
}

export const BedSchema = SchemaFactory.createForClass(Bed); 