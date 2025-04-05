import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Query, Patch } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { BedsService } from './beds.service';
import { CreateBedDto } from './dto/create-bed.dto';
import { UpdateBedDto } from './dto/update-bed.dto';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Bed, BedStatus } from '../entities/bed.entity';
import { managerRole } from 'src/entities/managers.entity';

@ApiTags('Beds')
@ApiBearerAuth()
@Controller('beds')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BedsController {
  constructor(private readonly bedsService: BedsService) {}

  @Post()
  @Roles(managerRole.ADMIN, managerRole.SUPER_ADMIN)
  @ApiOperation({ 
    summary: 'Create bed',
    description: 'Create a new bed record. Only accessible by ADMIN and SUPER_ADMIN roles.'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Bed has been successfully created.',
    type: Bed 
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
  create(@Body() createBedDto: CreateBedDto) {
    return this.bedsService.create(createBedDto);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Get all beds',
    description: 'Retrieve all beds with optional filtering and pagination.'
  })
  @ApiQuery({ 
    name: 'status', 
    enum: BedStatus, 
    required: false,
    description: 'Filter beds by status' 
  })
  @ApiQuery({ 
    name: 'roomId', 
    required: false,
    description: 'Filter beds by room ID' 
  })
  @ApiQuery({ 
    name: 'type', 
    required: false,
    description: 'Filter beds by type' 
  })
  @ApiQuery({ 
    name: 'page', 
    required: false,
    type: Number,
    description: 'Page number for pagination' 
  })
  @ApiQuery({ 
    name: 'limit', 
    required: false,
    type: Number,
    description: 'Number of items per page' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'List of beds.',
    type: [Bed] 
  })
  findAll(
    @Query('status') status?: BedStatus,
    @Query('roomId') roomId?: string,
    @Query('type') type?: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    // return this.bedsService.findAll({ status, roomId, type, page, limit });
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Get bed',
    description: 'Retrieve details of a specific bed by ID.'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'Bed ID',
    type: String,
    example: '507f1f77bcf86cd799439011'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'The bed details.',
    type: Bed 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Bed not found.' 
  })
  findOne(@Param('id') id: string) {
    return this.bedsService.findOne(id);
  }

  @Put(':id')
  @Roles(managerRole.ADMIN, managerRole.SUPER_ADMIN)
  @ApiOperation({ 
    summary: 'Update bed',
    description: 'Update a bed record. Only accessible by ADMIN and SUPER_ADMIN roles.'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'Bed ID',
    type: String,
    example: '507f1f77bcf86cd799439011'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Bed has been successfully updated.',
    type: Bed 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Bed not found.' 
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Forbidden - user does not have required roles.' 
  })
  update(@Param('id') id: string, @Body() updateBedDto: UpdateBedDto) {
    return this.bedsService.update(id, updateBedDto);
  }

  @Delete(':id')
  @Roles(managerRole.SUPER_ADMIN)
  @ApiOperation({ 
    summary: 'Delete bed',
    description: 'Delete a bed record. Only accessible by SUPER_ADMIN role.'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'Bed ID',
    type: String,
    example: '507f1f77bcf86cd799439011'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Bed has been successfully deleted.',
    type: Bed 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Bed not found.' 
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Forbidden - user does not have required roles.' 
  })
  remove(@Param('id') id: string) {
    return this.bedsService.remove(id);
  }

  @Post('room/:roomId')
  @ApiOperation({ 
    summary: 'Get room beds',
    description: 'Retrieve all beds in a specific room.'
  })
  @ApiParam({ 
    name: 'roomId', 
    description: 'Room ID',
    type: String,
    example: '507f1f77bcf86cd799439011'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'List of beds in the room.',
    type: [Bed] 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Room not found.' 
  })
  findByRoom(@Param('roomId') roomId: string,
  @Body() updateBedDto: UpdateBedDto
) {
    return this.bedsService.findByRoom(roomId,updateBedDto);
  }

  @Get('available/all')
  findAvailableBeds() {
    return this.bedsService.findAvailableBeds();
  }

  @Put(':id/assign/:userId')
  assignUser(@Param('id') id: string, @Param('userId') userId: string) {
    return this.bedsService.assignUser(id, userId);
  }

  @Put(':id/unassign')
  unassignUser(@Param('id') id: string) {
    return this.bedsService.unassignUser(id);
  }

  @Put(':id/maintenance')
  setMaintenance(@Param('id') id: string) {
    return this.bedsService.setMaintenance(id);
  }

  @Patch(':id/assign')
  @Roles(managerRole.ADMIN, managerRole.SUPER_ADMIN)
  @ApiOperation({ 
    summary: 'Assign bed',
    description: 'Assign a bed to a user. Only accessible by ADMIN and SUPER_ADMIN roles.'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'Bed ID',
    type: String,
    example: '507f1f77bcf86cd799439011'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Bed has been successfully assigned.',
    type: Bed 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Bed not found.' 
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Forbidden - user does not have required roles.' 
  })
  assignBed(
    @Param('id') id: string,
    @Body('userId') userId: string,
  ) {
    // return this.bedsService.assignBed(id, userId);
  }

  @Patch(':id/unassign')
  @Roles(managerRole.ADMIN, managerRole.SUPER_ADMIN)
  @ApiOperation({ 
    summary: 'Unassign bed',
    description: 'Remove user assignment from a bed. Only accessible by ADMIN and SUPER_ADMIN roles.'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'Bed ID',
    type: String,
    example: '507f1f77bcf86cd799439011'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Bed has been successfully unassigned.',
    type: Bed 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Bed not found.' 
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Forbidden - user does not have required roles.' 
  })
  unassignBed(@Param('id') id: string) {
    // return this.bedsService.unassignBed(id);
  }
}
