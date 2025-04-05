import { Injectable, NotFoundException, ForbiddenException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema as MongooseSchema } from 'mongoose';
import { User, UserRole } from '../entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userModel.findOne({ email: createUserDto.email });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const createdUser = new this.userModel({
      ...createUserDto,
      // password: hashedPassword,
    });

    return createdUser.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().select('-password').exec();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findById(id).select('-password').exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    // if (updateUserDto.email) {
    //   const existingUser = await this.userModel.findOne({
    //     email: updateUserDto.email,
    //     _id: { $ne: id },
    //   });
    //   if (existingUser) {
    //     throw new ConflictException('Email already exists');
    //   }
    // }

    // if (updateUserDto.password) {
    //   updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    // }

    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      // .select('-password')
      .exec();

    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }

    return updatedUser;
  }

  async remove(id: string): Promise<void> {
    const result = await this.userModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('User not found');
    }
  }

  async findUsersByRole(role: UserRole, currentUser: User) {
    // Only super admin and admin can filter users by role
    // if (currentUser.role !== UserRole.SUPER_ADMIN && currentUser.role !== UserRole.ADMIN) {
    //   throw new ForbiddenException('You do not have permission to filter users by role');
    // }

    return this.userModel.find({ role }).select('-password');
  }

  async assignRoom(userId: string, roomId: string): Promise<User> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const roomObjectId = new MongooseSchema.Types.ObjectId(roomId);
    if (!user.assignedRooms.includes(roomObjectId)) {
      user.assignedRooms.push(roomObjectId);
      await user.save();
    }

    const updatedUser = await this.userModel.findById(userId).select('-password').exec();
    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }
    return updatedUser;
  }

  async removeRoomAssignment(userId: string, roomId: string): Promise<User> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.assignedRooms = user.assignedRooms.filter(id => id.toString() !== roomId);
    await user.save();

    const updatedUser = await this.userModel.findById(userId).select('-password').exec();
    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }
    return updatedUser;
  }

  async updateRole(userId: string, role: UserRole): Promise<User> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // user.role = role;
    await user.save();

    const updatedUser = await this.userModel.findById(userId).select('-password').exec();
    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }
    return updatedUser;
  }

  async toggleActiveStatus(userId: string): Promise<User> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.isActive = !user.isActive;
    await user.save();

    const updatedUser = await this.userModel.findById(userId).select('-password').exec();
    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }
    return updatedUser;
  }

  // async validatePassword(userId: string, password: string): Promise<boolean> {
  //   const user = await this.userModel.findById(userId);
  //   if (!user) {
  //     throw new NotFoundException('User not found');
  //   }

  //   return bcrypt.compare(password, user.password);
  // }

  // async changePassword(userId: string, oldPassword: string, newPassword: string): Promise<void> {
  //   const isValid = await this.validatePassword(userId, oldPassword);
  //   if (!isValid) {
  //     throw new BadRequestException('Invalid old password');
  //   }

  //   const hashedPassword = await bcrypt.hash(newPassword, 10);
  //   await this.userModel.findByIdAndUpdate(userId, { password: hashedPassword }).exec();
  // }
}
