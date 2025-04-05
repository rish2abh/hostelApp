import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, Get, Patch, Param, Request, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
// import { CreateUserDto } from '../users/dto/create-user.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { User } from './decorators/user.decorator';
import { CreateManagerDto } from 'src/manager/dto/create-manager.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateManagerDto) {
    return this.authService.register(createUserDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: { email: string; password: string }) {
    const user = await this.authService.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.login(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@User() user: any) {
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Patch('change-password')
  async changePassword(
    @User() user: any,
    @Body() passwords: { oldPassword: string; newPassword: string },
  ) {
    return this.authService.changePassword(
      user._id,
      passwords.oldPassword,
      passwords.newPassword,
    );
  }
}
