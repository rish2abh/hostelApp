import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Query } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { PaymentStatus } from '../entities/payment.entity';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Payment } from '../entities/payment.entity';
import { managerRole } from 'src/entities/managers.entity';

@ApiTags('Payments')
// @ApiBearerAuth()
@Controller('payments')
// @UseGuards(JwtAuthGuard, RolesGuard)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post("create")
  // @Roles(managerRole.ADMIN, managerRole.SUPER_ADMIN)
  @ApiOperation({ 
    summary: 'Create payment',
    description: 'Create a new payment record. Only accessible by ADMIN and SUPER_ADMIN roles.'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Payment has been successfully created.',
    type: Payment 
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
  create(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentsService.create(createPaymentDto);
  }

  @Get("list")
  @ApiOperation({ 
    summary: 'Get all payments',
    description: 'Retrieve all payments with optional filtering and pagination.'
  })
  @ApiQuery({ 
    name: 'status', 
    enum: PaymentStatus, 
    required: false,
    description: 'Filter payments by status' 
  })
  @ApiQuery({ 
    name: 'userId', 
    required: false,
    description: 'Filter payments by user ID' 
  })
  @ApiQuery({ 
    name: 'roomId', 
    required: false,
    description: 'Filter payments by room ID' 
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
    description: 'List of payments.',
    type: [Payment] 
  })
  findAll(
    @Query('status') status?: PaymentStatus,
    @Query('userId') userId?: string,
    @Query('roomId') roomId?: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.paymentsService.findAll({ status, userId, roomId, page, limit });
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Get payment',
    description: 'Retrieve details of a specific payment by ID.'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'Payment ID',
    type: String,
    example: '507f1f77bcf86cd799439011'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'The payment details.',
    type: Payment 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Payment not found.' 
  })
  findOne(@Param('id') id: string) {
    return this.paymentsService.findOne(id);
  }

  @Put(':id')
  @Roles(managerRole.ADMIN, managerRole.SUPER_ADMIN)
  @ApiOperation({ 
    summary: 'Update payment',
    description: 'Update a payment record. Only accessible by ADMIN and SUPER_ADMIN roles.'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'Payment ID',
    type: String,
    example: '507f1f77bcf86cd799439011'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Payment has been successfully updated.',
    type: Payment 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Payment not found.' 
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Forbidden - user does not have required roles.' 
  })
  update(@Param('id') id: string, @Body() updatePaymentDto: UpdatePaymentDto) {
    return this.paymentsService.update(id, updatePaymentDto);
  }

  @Delete(':id')
  @Roles(managerRole.SUPER_ADMIN)
  @ApiOperation({ 
    summary: 'Delete payment',
    description: 'Delete a payment record. Only accessible by SUPER_ADMIN role.'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'Payment ID',
    type: String,
    example: '507f1f77bcf86cd799439011'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Payment has been successfully deleted.',
    type: Payment 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Payment not found.' 
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Forbidden - user does not have required roles.' 
  })
  remove(@Param('id') id: string) {
    return this.paymentsService.remove(id);
  }

  @Get('user/:userId')
  @ApiOperation({ 
    summary: 'Get user payments',
    description: 'Retrieve all payments for a specific user.'
  })
  @ApiParam({ 
    name: 'userId', 
    description: 'User ID',
    type: String,
    example: '507f1f77bcf86cd799439011'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'List of user payments.',
    type: [Payment] 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'User not found.' 
  })
  findByUser(@Param('userId') userId: string) {
    return this.paymentsService.findByUser(userId);
  }

  @Get('room/:roomId')
  @ApiOperation({ 
    summary: 'Get room payments',
    description: 'Retrieve all payments for a specific room.'
  })
  @ApiParam({ 
    name: 'roomId', 
    description: 'Room ID',
    type: String,
    example: '507f1f77bcf86cd799439011'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'List of room payments.',
    type: [Payment] 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Room not found.' 
  })
  findByRoom(@Param('roomId') roomId: string) {
    return this.paymentsService.findByRoom(roomId);
  }

  @Put(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: PaymentStatus,
  ) {
    return this.paymentsService.updateStatus(id, status);
  }

  @Get('stats/all')
  getPaymentStats() {
    return this.paymentsService.getPaymentStats();
  }

  @Get('history/:userId')
  getUserPaymentHistory(@Param('userId') userId: string) {
    return this.paymentsService.getUserPaymentHistory(userId);
  }
}
