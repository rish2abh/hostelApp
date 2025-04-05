import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Room } from '../entities/room.entity';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';

@Injectable()
export class RoomsService {
  constructor(
    @InjectModel(Room.name) private readonly roomModel: Model<Room>
  ) {}

  async create(createRoomDto: CreateRoomDto): Promise<Room> {
    const createdRoom = new this.roomModel(createRoomDto);
    return createdRoom.save();
  }

  async findAll(): Promise<Room[]> {
    return this.roomModel.find().exec();
  }

  async findOne(id: string): Promise<Room> {
    const room = await this.roomModel.findById(id).exec();
    if (!room) {
      throw new NotFoundException(`Room with ID ${id} not found`);
    }
    return room;
  }

  async update(id: string, updateRoomDto: UpdateRoomDto): Promise<Room> {
    const existingRoom = await this.roomModel
      .findByIdAndUpdate(id, updateRoomDto, { new: true })
      .exec();
    
    if (!existingRoom) {
      throw new NotFoundException(`Room with ID ${id} not found`);
    }
    return existingRoom;
  }

  async remove(id: string): Promise<Room> {
    const deletedRoom = await this.roomModel.findByIdAndDelete(id).exec();
    if (!deletedRoom) {
      throw new NotFoundException(`Room with ID ${id} not found`);
    }
    return deletedRoom;
  }

  async assignUser(roomId: string, userId: string): Promise<Room> {
    const room = await this.roomModel.findById(roomId).exec();
    if (!room) {
      throw new NotFoundException(`Room with ID ${roomId} not found`);
    }

    if (room.isOccupied) {
      throw new Error('Room is already occupied');
    }

    const updatedRoom = await this.roomModel.findByIdAndUpdate(
      roomId,
      {
        $set: {
          assignedUser: new Types.ObjectId(userId),
          isOccupied: true
        }
      },
      { new: true }
    ).exec();

    if (!updatedRoom) {
      throw new NotFoundException(`Room with ID ${roomId} not found`);
    }

    return updatedRoom;
  }

  async unassignUser(roomId: string): Promise<Room> {
    const room = await this.roomModel.findById(roomId).exec();
    if (!room) {
      throw new NotFoundException(`Room with ID ${roomId} not found`);
    }

    const updatedRoom = await this.roomModel.findByIdAndUpdate(
      roomId,
      {
        $unset: { assignedUser: 1 },
        $set: { isOccupied: false }
      },
      { new: true }
    ).exec();

    if (!updatedRoom) {
      throw new NotFoundException(`Room with ID ${roomId} not found`);
    }

    return updatedRoom;
  }

  async findAvailableRooms(): Promise<Room[]> {
    return this.roomModel.find({ isOccupied: false, isActive: true }).exec();
  }

  async findByFloor(floor: number): Promise<Room[]> {
    return this.roomModel.find({ floor }).exec();
  }
}
