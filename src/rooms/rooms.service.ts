import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Types } from 'mongoose';
import { Room } from '../entities/room.entity';
import { AssignRoomDTO, CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { User } from 'src/entities/user.entity';
import { Bed } from 'src/entities/bed.entity';

@Injectable()
export class RoomsService {
  constructor(
    @InjectModel(Room.name) private readonly roomModel: Model<Room>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Bed.name) private readonly bedModel: Model<Bed>
  ) {}

  async create(createRoomDto: CreateRoomDto): Promise<Room> {
    const createdRoom = new this.roomModel(createRoomDto);
    return createdRoom.save();
  }

  async findAll(): Promise<Room[]> {
    return this.roomModel.find({isActive: true}).exec();
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

  async assignUser(assignRoomDTO: AssignRoomDTO): Promise<Room> {
    const roomId = new Types.ObjectId(assignRoomDTO.roomId);
    const bedId = new Types.ObjectId(assignRoomDTO.bedId);
    const userId = new Types.ObjectId(assignRoomDTO.userId);
  
    // Step 1: Fetch room with beds
    const roomBeds = await this.roomModel.aggregate([
      { $match: { _id: roomId } },
      {
        $lookup: {
          from: "beds",
          localField: "_id",
          foreignField: "roomId",
          as: "beds",
        }
      },
      {
        $addFields: {
          occupiedBeds: {
            $size: {
              $filter: {
                input: "$beds",
                as: "bed",
                cond: { $eq: ["$$bed.status", "OCCUPIED"] }
              }
            }
          }
        }
      }
    ]);
  
    const room = roomBeds[0];
  
    if (!room) throw new NotFoundException(`Room with ID ${assignRoomDTO.roomId} not found`);
  
    const user = await this.userModel.findById(userId);
    if( !user ||user.assignedRooms || user.assignedBed) throw new BadRequestException('Selected User have already assign room and bed');

    const selectedBed = room.beds.find(
      (bed: any) => bed._id.toString() === bedId.toString()
    );
  
    if (!selectedBed) throw new NotFoundException(`Bed with ID ${assignRoomDTO.bedId} not found in the room`);
  
    if (selectedBed.status !== 'AVAILABLE')  throw new BadRequestException('Selected bed is not available');
  
    if (room.isOccupied || room.occupiedBeds >= room.capacity)  throw new BadRequestException('Room is already fully occupied');
  
    await this.bedModel.findByIdAndUpdate(bedId, {
      $set: {
        status: 'OCCUPIED',
        assignedUser: userId
      }
    });
  
    await this.userModel.findByIdAndUpdate(userId, {
      $set: {
        assignedRoom: roomId,
        assignedBed: bedId
      }
    });
  
    const isNowFullyOccupied = room.occupiedBeds + 1 === room.capacity;
  
    const updatedRoom = await this.roomModel.findByIdAndUpdate(
      roomId,
      {
        $set: {
          isOccupied: isNowFullyOccupied
        }
      },
      { new: true }
    ).exec()
  
    if (!updatedRoom) throw new NotFoundException(`Room with ID ${assignRoomDTO.roomId} not found during update`);
    

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
