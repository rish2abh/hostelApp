import mongoose, { Schema, Document } from 'mongoose';

export enum RoomType {
  SINGLE = 'SINGLE',
  DOUBLE = 'DOUBLE',
  TRIPLE = 'TRIPLE',
  QUAD = 'QUAD',
  SUITE = 'SUITE'
}

export enum RoomStatus {
  AVAILABLE = 'AVAILABLE',
  PARTIALLY_OCCUPIED = 'PARTIALLY_OCCUPIED',
  FULLY_OCCUPIED = 'FULLY_OCCUPIED',
  MAINTENANCE = 'MAINTENANCE',
  RESERVED = 'RESERVED'
}

export interface IRoom extends Document {
  number: string;
  floor: number;
  type: RoomType;
  capacity: number;
  occupied: number;
  status: RoomStatus;
  price: number;
  facilities: string[];
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const roomSchema = new Schema({
  number: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  floor: {
    type: Number,
    required: true,
    min: 0
  },
  type: {
    type: String,
    enum: Object.values(RoomType),
    required: true
  },
  capacity: {
    type: Number,
    required: true,
    min: 1
  },
  occupied: {
    type: Number,
    default: 0,
    min: 0
  },
  status: {
    type: String,
    enum: Object.values(RoomStatus),
    required: true,
    default: RoomStatus.AVAILABLE
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  facilities: [{
    type: String,
    trim: true
  }],
  description: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Add index for better query performance
roomSchema.index({ floor: 1, type: 1, status: 1 });

// Add middleware to update status based on occupancy
roomSchema.pre('save', function(next) {
  if (this.occupied === 0) {
    this.status = RoomStatus.AVAILABLE;
  } else if (this.occupied < this.capacity) {
    this.status = RoomStatus.PARTIALLY_OCCUPIED;
  } else if (this.occupied === this.capacity) {
    this.status = RoomStatus.FULLY_OCCUPIED;
  }
  next();
});

export const Room = mongoose.model<IRoom>('Room', roomSchema); 