import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, UseInterceptors, UploadedFile } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto, UploadImageDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { User } from '../auth/decorators/user.decorator';
import { managerRole } from 'src/entities/managers.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';

@Controller('users')
// @UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  // @Roles(managerRole.SUPER_ADMIN, managerRole.ADMIN)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get("getAll")
  // @Roles(managerRole.SUPER_ADMIN, managerRole.ADMIN)
  findAll() {
    return this.usersService.findAll();
  }

  @Get('me')
  getProfile(@User() user: any) {
    return this.usersService.findOne(user._id);
  }

  @Get(':id')
  // @Roles(managerRole.SUPER_ADMIN, managerRole.ADMIN)
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Post('update/:id')
  // @Roles(managerRole.SUPER_ADMIN, managerRole.ADMIN)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  // @Roles(managerRole.SUPER_ADMIN)
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Post(':id/rooms/:roomId')
  // @Roles(managerRole.SUPER_ADMIN, managerRole.ADMIN)
  assignRoom(
    @Param('id') id: string,
    @Param('roomId') roomId: string,
  ) {
    return this.usersService.assignRoom(id, roomId)
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UploadImageDto }) 
  upload(@UploadedFile() file: Express.Multer.File) {
    return this.usersService.uploadDoc(file);
  }

  @Delete(':id/rooms/:roomId')
  // @Roles(managerRole.SUPER_ADMIN, managerRole.ADMIN)
  removeRoomAssignment(
    @Param('id') id: string,
    @Param('roomId') roomId: string,
  ) {
    return this.usersService.removeRoomAssignment(id, roomId);
  }

  // @Patch(':id/role')
  // // @Roles(managerRole.SUPER_ADMIN)
  // updateRole(
  //   @Param('id') id: string,
  //   @Body('role') role: managerRole,
  // ) {
  //   return this.usersService.updateRole(id, role);
  // }

  @Patch(':id/toggle-active')
  // @Roles(managerRole.SUPER_ADMIN, managerRole.ADMIN)
  toggleActiveStatus(@Param('id') id: string) {
    return this.usersService.toggleActiveStatus(id);
  }

  // @Post(':id/change-password')
  // changePassword(
  //   @Param('id') id: string,
  //   @Body('oldPassword') oldPassword: string,
  //   @Body('newPassword') newPassword: string,
  // ) {
  //   return this.usersService.changePassword(id, oldPassword, newPassword);
  // }
}
