import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ManagerService } from './manager.service';
import { CreateManagerDto } from './dto/create-manager.dto';
import { UpdateManagerDto } from './dto/update-manager.dto';
import { managerRole } from 'src/entities/managers.entity';
import { User } from '../auth/decorators/user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';


@Controller('manager')
@UseGuards(JwtAuthGuard, RolesGuard)

export class ManagerController {
  constructor(private readonly managerService: ManagerService) {}

  @Post()
  @Roles(managerRole.SUPER_ADMIN, managerRole.ADMIN)
  create(@Body() createManagerDto: CreateManagerDto) {
    return this.managerService.create(createManagerDto);
  }

  @Get()
  // @Roles(managerRole.SUPER_ADMIN, managerRole.ADMIN)
  findAll() {
    return this.managerService.findAll();
  }

  @Get('me')
  getProfile(@User() user: any) {
    return this.managerService.findOne(user._id);
  }

  @Get(':id')
  // @Roles(managerRole.SUPER_ADMIN, managerRole.ADMIN)
  findOne(@Param('id') id: string) {
    return this.managerService.findOne(id);
  }

  @Patch(':id')
  // @Roles(managerRole.SUPER_ADMIN, managerRole.ADMIN)
  update(@Param('id') id: string, @Body() updateManagerDto: UpdateManagerDto) {
    return this.managerService.update(id, updateManagerDto);
  }

  @Delete(':id')
  // @Roles(managerRole.SUPER_ADMIN)
  remove(@Param('id') id: string) {
    return this.managerService.remove(id);
  }

  // @Post(':id/rooms/:roomId')
  // // @Roles(managerRole.SUPER_ADMIN, managerRole.ADMIN)
  // assignRoom(
  //   @Param('id') id: string,
  //   @Param('roomId') roomId: string,
  // ) {
  //   return this.managerService.assignRoom(id, roomId);
  // }

  // @Delete(':id/rooms/:roomId')
  // // @Roles(managerRole.SUPER_ADMIN, managerRole.ADMIN)
  // removeRoomAssignment(
  //   @Param('id') id: string,
  //   @Param('roomId') roomId: string,
  // ) {
  //   return this.managerService.removeRoomAssignment(id, roomId);
  // }

  @Patch(':id/role')
  // @Roles(managerRole.SUPER_ADMIN)
  updateRole(
    @Param('id') id: string,
    @Body('role') role: managerRole,
  ) {
    return this.managerService.updateRole(id, role);
  }

  @Patch(':id/toggle-active')
  // @Roles(managerRole.SUPER_ADMIN, managerRole.ADMIN)
  toggleActiveStatus(@Param('id') id: string) {
    return this.managerService.toggleActiveStatus(id);
  }

  @Post(':id/change-password')
  changePassword(
    @Param('id') id: string,
    @Body('oldPassword') oldPassword: string,
    @Body('newPassword') newPassword: string,
  ) {
    return this.managerService.changePassword(id, oldPassword, newPassword);
  }
}
