import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody } from '@nestjs/swagger';
import { RoomsService } from './rooms.service';
import { AssignRoomDTO, CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Room } from '../entities/room.entity';
import { managerRole } from 'src/entities/managers.entity';

@ApiTags('Rooms')
// @ApiBearerAuth()
@Controller('rooms')
// @UseGuards(JwtAuthGuard, RolesGuard)
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post("create")
  // @Roles(managerRole.ADMIN, managerRole.SUPER_ADMIN)
  @ApiOperation({ 
    summary: 'Create a new room',
    description: 'Creates a new room in the system. Only accessible by ADMIN and SUPER_ADMIN roles.'
  })
  // @ApiBody({ type: CreateRoomDto })
  @ApiResponse({ 
    status: 201, 
    description: 'Room has been successfully created.',
    type: Room 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Bad request - validation error or invalid data provided.' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized - JWT token is missing or invalid.' 
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Forbidden - user does not have required roles.' 
  })
  create(@Body() createRoomDto: CreateRoomDto) {
    return this.roomsService.create(createRoomDto);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Get all rooms',
    description: 'Retrieves a list of all rooms in the system.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'List of all rooms.',
    type: [Room] 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized - JWT token is missing or invalid.' 
  })
  findAll() {
    return this.roomsService.findAll();
  }

  @Get('available')
  @ApiOperation({ 
    summary: 'Get available rooms',
    description: 'Retrieves a list of all available (unoccupied and active) rooms.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'List of available rooms.',
    type: [Room] 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized - JWT token is missing or invalid.' 
  })
  findAvailable() {
    return this.roomsService.findAvailableRooms();
  }

  @Get('floor/:floor')
  @ApiOperation({ 
    summary: 'Get rooms by floor',
    description: 'Retrieves all rooms on a specific floor.'
  })
  @ApiParam({ 
    name: 'floor', 
    description: 'Floor number to search for',
    type: 'number',
    example: 1
  })
  @ApiResponse({ 
    status: 200, 
    description: 'List of rooms on the specified floor.',
    type: [Room] 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized - JWT token is missing or invalid.' 
  })
  findByFloor(@Param('floor') floor: string) {
    return this.roomsService.findByFloor(+floor);
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Get room by ID',
    description: 'Retrieves details of a specific room by its ID.'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'Room ID',
    type: 'string',
    example: '507f1f77bcf86cd799439011'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'The room details.',
    type: Room 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Room not found.' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized - JWT token is missing or invalid.' 
  })
  findOne(@Param('id') id: string) {
    return this.roomsService.findOne(id);
  }

  @Patch(':id')
  @Roles(managerRole.ADMIN, managerRole.SUPER_ADMIN)
  @ApiOperation({ 
    summary: 'Update room',
    description: 'Updates details of a specific room. Only accessible by ADMIN and SUPER_ADMIN roles.'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'Room ID',
    type: 'string',
    example: '507f1f77bcf86cd799439011'
  })
  @ApiBody({ type: UpdateRoomDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Room has been successfully updated.',
    type: Room 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Room not found.' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized - JWT token is missing or invalid.' 
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Forbidden - user does not have required roles.' 
  })
  update(@Param('id') id: string, @Body() updateRoomDto: UpdateRoomDto) {
    return this.roomsService.update(id, updateRoomDto);
  }

  @Delete(':id')
  @Roles(managerRole.ADMIN, managerRole.SUPER_ADMIN)
  @ApiOperation({ 
    summary: 'Delete room',
    description: 'Deletes a specific room. Only accessible by ADMIN and SUPER_ADMIN roles.'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'Room ID',
    type: 'string',
    example: '507f1f77bcf86cd799439011'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Room has been successfully deleted.',
    type: Room 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Room not found.' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized - JWT token is missing or invalid.' 
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Forbidden - user does not have required roles.' 
  })
  remove(@Param('id') id: string) {
    return this.roomsService.remove(id);
  }

  @Post('assignRoom')
  // @Roles(managerRole.ADMIN, managerRole.SUPER_ADMIN)
  @ApiOperation({ 
    summary: 'Assign user to room',
    description: 'Assigns a user to a specific room. Only accessible by ADMIN and SUPER_ADMIN roles.'
  })
  assignUser(@Body() assignRoomDTO :AssignRoomDTO ) {
    return this.roomsService.assignUser(assignRoomDTO);
  }

  @Patch(':id/unassign')
  @Roles(managerRole.ADMIN, managerRole.SUPER_ADMIN)
  @ApiOperation({ 
    summary: 'Unassign user from room',
    description: 'Removes user assignment from a specific room. Only accessible by ADMIN and SUPER_ADMIN roles.'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'Room ID',
    type: 'string',
    example: '507f1f77bcf86cd799439011'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'User has been successfully unassigned from the room.',
    type: Room 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Room not found.' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized - JWT token is missing or invalid.' 
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Forbidden - user does not have required roles.' 
  })
  unassignUser(@Param('id') id: string) {
    return this.roomsService.unassignUser(id);
  }
}
