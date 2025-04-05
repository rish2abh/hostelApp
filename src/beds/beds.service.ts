import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Types, Schema as MongooseSchema } from 'mongoose';
import { Bed, BedStatus } from '../entities/bed.entity';
import { CreateBedDto } from './dto/create-bed.dto';
import { UpdateBedDto } from './dto/update-bed.dto';
import { Room } from 'src/entities/room.entity';
import { User } from 'src/entities/user.entity';

@Injectable()
export class BedsService {
  constructor(
    @InjectModel(Bed.name) private bedModel: Model<Bed>,
    @InjectModel(Room.name) private roomModel: Model<Room>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async create(createBedDto: CreateBedDto) {
    const roomId = new mongoose.Types.ObjectId(createBedDto.roomId);
  
    // Run room and existing bed check in parallel
    const [room, existingBed] = await Promise.all([
      this.roomModel.findById(roomId).exec(),
      this.bedModel.findOne({ roomId, bedNumber: createBedDto.bedNumber }).exec(),
    ]);
  
    if (!room) {
      throw new BadRequestException('Room does not exist');
    }
  
    if (existingBed)  throw new BadRequestException('Bed number already exists in this room');
  
    const bedCount = await this.bedModel.countDocuments({ roomId }).exec();
  
    if (bedCount >= room.capacity) {
      throw new BadRequestException('Max number of beds already exist in this room');
    }
  
    const bed = new this.bedModel(createBedDto);
    return bed.save();
  }
  
  async findAll() {
    return this.bedModel
      .find()
      .populate('roomId', 'roomNumber')
      .populate('assignedUser', 'firstName lastName email');
  }

  async findOne(id: string) {
    const bed = await this.bedModel
      .findById(id)
      .populate('roomId', 'roomNumber')
      .populate('assignedUser', 'firstName lastName email');

    if (!bed) {
      throw new NotFoundException('Bed not found');
    }

    return bed;
  }

  async update(id: string, updateBedDto: UpdateBedDto) {
    const bed = await this.bedModel
      .findByIdAndUpdate(id, updateBedDto, { new: true })
      .populate('roomId', 'roomNumber')
      .populate('assignedUser', 'firstName lastName email');

    if (!bed) {
      throw new NotFoundException('Bed not found');
    }

    return bed;
  }

  async remove(id: string) {
    const bed = await this.bedModel.findById(id);
    if (!bed) {
      throw new NotFoundException('Bed not found');
    }

    if (bed.status === BedStatus.OCCUPIED) {
      throw new BadRequestException('Cannot delete an occupied bed');
    }

    await this.bedModel.findByIdAndDelete(id);
    return { message: 'Bed deleted successfully' };
  }

  async findByRoom(roomId: string, updateBedDto: UpdateBedDto) {
    const filter: any = { roomId: new mongoose.Types.ObjectId(roomId) };
  
    if (updateBedDto.status !== 'ALL') {
      filter.status = updateBedDto.status;
    }
  
    const data = await this.bedModel
      .find(filter)
      .populate('users', 'firstName lastName email') // Reverse populate from User collection
      .exec();
  
    return data || [];
  }
  

  async findAvailableBeds() {
    return this.bedModel
      .find({ status: BedStatus.AVAILABLE, isActive: true })
      .populate('roomId', 'roomNumber');
  }

  async assignUser(bedId: string, userId: string) {
    const bed = await this.bedModel.findById(bedId);
    if (!bed) {
      throw new NotFoundException('Bed not found');
    }
  
    if (bed.status === BedStatus.OCCUPIED) {
      throw new BadRequestException('Bed is already occupied');
    }
  
    if (bed.status === BedStatus.MAINTENANCE) {
      throw new BadRequestException('Bed is under maintenance');
    }
  
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
  
    await this.userModel.updateOne(
      { _id: new mongoose.Types.ObjectId(userId) },
      {
        $set: {
          assignedRoom: bed.roomId,
          assignedBed: bed._id,
        },
      }
    );
  
    // Update bed status
    bed.status = BedStatus.OCCUPIED;
    return bed.save();
  }
  

  async unassignUser(bedId: string) {
    const bed = await this.bedModel.findById(bedId);
    if (!bed) {
      throw new NotFoundException('Bed not found');
    }

    if (bed.status !== BedStatus.OCCUPIED) {
      throw new BadRequestException('Bed is not occupied');
    }

    // delete bed.assignedUser;
    bed.status = BedStatus.AVAILABLE;
    return bed.save();
  }

  async setMaintenance(bedId: string) {
    const bed = await this.bedModel.findById(bedId);
    if (!bed) {
      throw new NotFoundException('Bed not found');
    }

    if (bed.status === BedStatus.OCCUPIED) {
      throw new BadRequestException('Cannot set occupied bed to maintenance');
    }

    bed.status = BedStatus.MAINTENANCE;
    return bed.save();
  }
}
