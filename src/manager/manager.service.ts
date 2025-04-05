import { Injectable, NotFoundException, ForbiddenException, ConflictException, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { CreateManagerDto, LoginDto } from './dto/create-manager.dto';
import { UpdateManagerDto } from './dto/update-manager.dto';
import { Manager, managerRole } from 'src/entities/managers.entity';
import { Model, Schema as MongooseSchema } from 'mongoose';
import { JwtService } from '@nestjs/jwt'
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';



@Injectable()
export class ManagerService {

  constructor(
     @InjectModel(Manager.name) private managerModel: Model<Manager>,
     private readonly jwtService: JwtService,
   ) {}


  async create(createUserDto: CreateManagerDto): Promise<Manager> {
    const existingUser = await this.managerModel.findOne({ email: createUserDto.email });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const createdUser = new this.managerModel({
      ...createUserDto,
      password: hashedPassword,
    });

    return createdUser.save();
  }

  async login(loginDto: LoginDto): Promise<{ token: string }> {
    const isUser = await this.managerModel.findOne({ email: loginDto.email });
  
    if (!isUser) {
      throw new ConflictException('Incorrect email. Please check and try again.');
    }
  
    const isPasswordMatch = await bcrypt.compare(loginDto.password, isUser.password);
  
    if (!isPasswordMatch) {
      throw new UnauthorizedException('Incorrect password');
    }
  
    const payload = {
      sub: isUser._id,
      email: isUser.email,
      role: isUser.role,
      permission: isUser.permissions,
    };
  
    const token = await this.jwtService.signAsync(payload);
  
    return { token };
  }

  async findAll(): Promise<Manager[]> {
    return this.managerModel.find().select('-password').exec();
  }

  async findOne(id: string): Promise<Manager> {
    const user = await this.managerModel.findById(id).select('-password').exec();
    if (!user) {
      throw new NotFoundException('Manager not found');
    }
    return user;
  }

  async findByEmail(email: string): Promise<Manager> {
    const user = await this.managerModel.findOne({ email }).exec();
    if (!user) {
      throw new NotFoundException('Manager not found');
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateManagerDto): Promise<Manager> {
    if (updateUserDto.email) {
      const existingUser = await this.managerModel.findOne({
        email: updateUserDto.email,
        _id: { $ne: id },
      });
      if (existingUser) {
        throw new ConflictException('Email already exists');
      }
    }

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    const updatedUser = await this.managerModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .select('-password')
      .exec();

    if (!updatedUser) {
      throw new NotFoundException('Manager not found');
    }

    return updatedUser;
  }

  async remove(id: string): Promise<void> {
    const result = await this.managerModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Manager not found');
    }
  }

  async findUsersByRole(role: managerRole, currentUser: Manager) {
    // Only super admin and admin can filter users by role
    if (currentUser.role !== managerRole.SUPER_ADMIN && currentUser.role !== managerRole.ADMIN) {
      throw new ForbiddenException('You do not have permission to filter users by role');
    }

    return this.managerModel.find({ role }).select('-password');
  }

  // async assignRoom(userId: string, roomId: string): Promise<Manager> {
  //   const user = await this.managerModel.findById(userId);
  //   if (!user) {
  //     throw new NotFoundException('Manager not found');
  //   }

  //   const roomObjectId = new MongooseSchema.Types.ObjectId(roomId);
  //   if (!user.assignedRooms.includes(roomObjectId)) {
  //     user.assignedRooms.push(roomObjectId);
  //     await user.save();
  //   }

  //   const updatedUser = await this.managerModel.findById(userId).select('-password').exec();
  //   if (!updatedUser) {
  //     throw new NotFoundException('Manager not found');
  //   }
  //   return updatedUser;
  // }

  // async removeRoomAssignment(userId: string, roomId: string): Promise<Manager> {
  //   const user = await this.managerModel.findById(userId);
  //   if (!user) {
  //     throw new NotFoundException('Manager not found');
  //   }

  //   user.assignedRooms = user.assignedRooms.filter(id => id.toString() !== roomId);
  //   await user.save();

  //   const updatedUser = await this.managerModel.findById(userId).select('-password').exec();
  //   if (!updatedUser) {
  //     throw new NotFoundException('Manager not found');
  //   }
  //   return updatedUser;
  // }

  async updateRole(userId: string, role: managerRole): Promise<Manager> {
    const user = await this.managerModel.findById(userId);
    if (!user) {
      throw new NotFoundException('Manager not found');
    }

    user.role = role;
    await user.save();

    const updatedUser = await this.managerModel.findById(userId).select('-password').exec();
    if (!updatedUser) {
      throw new NotFoundException('Manager not found');
    }
    return updatedUser;
  }

  async toggleActiveStatus(userId: string): Promise<Manager> {
    const user = await this.managerModel.findById(userId);
    if (!user) {
      throw new NotFoundException('Manager not found');
    }

    user.isActive = !user.isActive;
    await user.save();

    const updatedUser = await this.managerModel.findById(userId).select('-password').exec();
    if (!updatedUser) {
      throw new NotFoundException('Manager not found');
    }
    return updatedUser;
  }

  async validatePassword(userId: string, password: string): Promise<boolean> {
    const user = await this.managerModel.findById(userId);
    if (!user) {
      throw new NotFoundException('Manager not found');
    }

    return bcrypt.compare(password, user.password);
  }

  async changePassword(userId: string, oldPassword: string, newPassword: string): Promise<void> {
    const isValid = await this.validatePassword(userId, oldPassword);
    if (!isValid) {
      throw new BadRequestException('Invalid old password');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.managerModel.findByIdAndUpdate(userId, { password: hashedPassword }).exec();
  }
}
