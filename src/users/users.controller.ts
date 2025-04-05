import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../entities/user.entity';
import { User } from '../auth/decorators/user.decorator';

@Controller('users')
// @UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  // @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  // @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  findAll() {
    return this.usersService.findAll();
  }

  @Get('me')
  getProfile(@User() user: any) {
    return this.usersService.findOne(user._id);
  }

  @Get(':id')
  // @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  // @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  // @Roles(UserRole.SUPER_ADMIN)
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Post(':id/rooms/:roomId')
  // @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  assignRoom(
    @Param('id') id: string,
    @Param('roomId') roomId: string,
  ) {
    return this.usersService.assignRoom(id, roomId);
  }

  @Delete(':id/rooms/:roomId')
  // @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  removeRoomAssignment(
    @Param('id') id: string,
    @Param('roomId') roomId: string,
  ) {
    return this.usersService.removeRoomAssignment(id, roomId);
  }

  @Patch(':id/role')
  // @Roles(UserRole.SUPER_ADMIN)
  updateRole(
    @Param('id') id: string,
    @Body('role') role: UserRole,
  ) {
    return this.usersService.updateRole(id, role);
  }

  @Patch(':id/toggle-active')
  // @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  toggleActiveStatus(@Param('id') id: string) {
    return this.usersService.toggleActiveStatus(id);
  }

  @Post(':id/change-password')
  changePassword(
    @Param('id') id: string,
    @Body('oldPassword') oldPassword: string,
    @Body('newPassword') newPassword: string,
  ) {
    return this.usersService.changePassword(id, oldPassword, newPassword);
  }
}
