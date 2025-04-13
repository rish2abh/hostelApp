import { Injectable, NotFoundException, ForbiddenException, ConflictException, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { CreateManagerDto, DashboardDTO, LoginDto } from './dto/create-manager.dto';
import { UpdateManagerDto } from './dto/update-manager.dto';
import { Manager, managerRole } from 'src/entities/managers.entity';
import { Model, Schema as MongooseSchema } from 'mongoose';
import { JwtService } from '@nestjs/jwt'
import * as moment from 'moment';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Expense } from 'src/entities/expense.entity';
import { Payment } from 'src/entities/payment.entity';



@Injectable()
export class ManagerService {

  constructor(
     @InjectModel(Manager.name) private managerModel: Model<Manager>,
     @InjectModel(Expense.name) private expenseModel: Model<Expense>,
     @InjectModel(Payment.name) private paymentModel: Model<Payment>,
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



  async dashboard(user: any, dashBoardDTO: DashboardDTO): Promise<any> {
    const { startDate, endDate } = dashBoardDTO;
  
    const end = endDate ? new Date(endDate) : new Date();
    const start = startDate ? new Date(startDate) : moment(end).subtract(3, 'months').toDate();
  
    // Get all expense and earnings in given date range
    const expenses = await this.expenseModel.find({
      expenseDate: { $gte: start, $lte: end },
    });
  
    const earnings = await this.paymentModel.find({
      date: { $gte: start, $lte: end },
    });
  
    // Current year (used for total)
    const currentYear = new Date().getFullYear();
  
    let yearlyExpenseTotal = 0;
    let yearlyEarningTotal = 0;
  
    const expenseByMonth: Record<string, number> = {};
    const earningByMonth: Record<string, number> = {};
  
    // Process expenses
    for (const expense of expenses) {
      const date = new Date(expense.expenseDate);
      const month = moment(date).format('YYYY-MM');
      const amount = Number(expense.amount) || 0;
  
      // Month-wise
      expenseByMonth[month] = (expenseByMonth[month] || 0) + amount;
  
      // Yearly
      if (date.getFullYear() === currentYear) {
        yearlyExpenseTotal += amount;
      }
    }
  
    // Process earnings
    for (const payment of earnings) {
      const date = new Date(payment.date);
      const month = moment(date).format('YYYY-MM');
      const total = payment.collectionItems?.reduce((sum, item) => {
        return sum + (Number(item.amount) || 0);
      }, 0) || 0;
  
      // Month-wise
      earningByMonth[month] = (earningByMonth[month] || 0) + total;
  
      // Yearly
      if (date.getFullYear() === currentYear) {
        yearlyEarningTotal += total;
      }
    }
  
    // Combine unique months
    const allMonths = Array.from(
      new Set([...Object.keys(expenseByMonth), ...Object.keys(earningByMonth)])
    ).sort();
  
    const dashboardData = allMonths.map(month => ({
      month,
      totalExpense: expenseByMonth[month] || 0,
      totalEarning: earningByMonth[month] || 0,
    }));
  
    return {
      startDate: start,
      endDate: end,
      data: dashboardData,
      totalThisYear: {
        year: currentYear,
        totalExpense: yearlyExpenseTotal,
        totalEarning: yearlyEarningTotal,
      }
    };
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
