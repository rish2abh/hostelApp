import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, Schema as MongooseSchema } from 'mongoose';
import { Bed, BedStatus } from '../entities/bed.entity';
import { CreateBedDto } from './dto/create-bed.dto';
import { UpdateBedDto } from './dto/update-bed.dto';

@Injectable()
export class BedsService {
  constructor(
    @InjectModel(Bed.name) private bedModel: Model<Bed>,
  ) {}

  async create(createBedDto: CreateBedDto) {
    // Check if bed number already exists in the same room
    const existingBed = await this.bedModel.findOne({
      roomId: createBedDto.roomId,
      bedNumber: createBedDto.bedNumber,
    });

    if (existingBed) {
      throw new BadRequestException('Bed number already exists in this room');
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

  async findByRoom(roomId: string) {
    return this.bedModel
      .find({ roomId })
      .populate('assignedUser', 'firstName lastName email');
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

    // bed.assignedUser = new MongooseSchema.Types.ObjectId(userId);
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
