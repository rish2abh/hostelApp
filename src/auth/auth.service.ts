import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
// import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthUser } from './interfaces/user.interface';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { ManagerService } from 'src/manager/manager.service';
import { CreateManagerDto } from 'src/manager/dto/create-manager.dto';

@Injectable()
export class AuthService {
  constructor(
    private managerService: ManagerService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<AuthUser | null> {
    const user = await this.managerService.findByEmail(email);
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user.toObject();
      return {
        ...result,
        assignedRooms: result.assignedRooms?.map(id => id.toString()) || [],
      } as AuthUser;
    }
    return null;
  }

  async login(user: AuthUser) {
    const payload: JwtPayload = { email: user.email, sub: user._id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        isActive: user.isActive,
        phoneNumber: user.phoneNumber,
        assignedRooms: user.assignedRooms,
      },
    };
  }

  async register(createManagerDto: CreateManagerDto) {
    const user = await this.managerService.create(createManagerDto);
    const { password, ...result } = user.toObject();
    const authUser: AuthUser = {
      ...result,
      assignedRooms: result.assignedRooms?.map(id => id.toString()) || [],
    };
    return this.login(authUser);
  }

  async changePassword(userId: string, oldPassword: string, newPassword: string) {
    const isValid = await this.managerService.validatePassword(userId, oldPassword);
    if (!isValid) {
      throw new UnauthorizedException('Invalid old password');
    }
    await this.managerService.changePassword(userId, oldPassword, newPassword);
    return { message: 'Password changed successfully' };
  }
}
