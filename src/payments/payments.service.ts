import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Payment, PaymentStatus } from '../entities/payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';

interface FindAllParams {
  status?: string;
  userId?: string;
  roomId?: string;
  page?: number;
  limit?: number;
}

@Injectable()
export class PaymentsService {
  constructor(
    @InjectModel(Payment.name) private paymentModel: Model<Payment>,
  ) {}

  async create(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    try {

      const createdPayment = new this.paymentModel(createPaymentDto)    
      return createdPayment.save();
  } catch (error) {
      console.log(error.message);
      throw error
      
  }
  }

  async findAll(params: FindAllParams): Promise<{ data: Payment[]; total: number; page: number; limit: number }> {
    const { status, userId, roomId, page = 1, limit = 10 } = params;
    const query: any = {};

    if (status) query.status = status;
    if (userId) query.userId = userId;
    if (roomId) query.roomId = roomId;

    const skip = (page - 1) * limit;
    
    const [rawData, total] = await Promise.all([
      this.paymentModel
        .find(query)
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
      this.paymentModel.countDocuments(query),
    ]);
  
    // Add `totalCollection` for each record
    const data = rawData.map(payment => {
      const totalCollection = payment.collectionItems?.reduce((sum, item) => sum + (item.amount || 0), 0) || 0;
      return { ...payment, totalCollection };
    });

    return {
      data,
      total,
      page: Number(page),
      limit: Number(limit),
    };
  }

  async findOne(id: string): Promise<Payment> {
    const payment = await this.paymentModel.findById(id).exec();
    if (!payment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }
    return payment;
  }

  async update(id: string, updatePaymentDto: UpdatePaymentDto): Promise<Payment> {
    const existingPayment = await this.paymentModel
      .findByIdAndUpdate(id, updatePaymentDto, { new: true })
      .exec();
    
    if (!existingPayment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }
    
    return existingPayment;
  }

  async remove(id: string): Promise<Payment> {
    const deletedPayment = await this.paymentModel.findByIdAndDelete(id).exec();
    
    if (!deletedPayment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }
    
    return deletedPayment;
  }

  async findByUser(userId: string): Promise<Payment[]> {
    return this.paymentModel.find({ userId }).exec();
  }

  async findByRoom(roomId: string): Promise<Payment[]> {
    return this.paymentModel.find({ roomId }).exec();
  }

  async updateStatus(id: string, status: PaymentStatus) {
    const payment = await this.paymentModel.findById(id);
    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    payment[0].status = status;
    if (status === PaymentStatus.COMPLETED) {
      payment[0].date = new Date();
    }

    return payment.save();
  }

  async getPaymentStats() {
    const stats = await this.paymentModel.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' },
        },
      },
    ]);

    return stats;
  }

  async getUserPaymentHistory(userId: string) {
    return this.paymentModel
      .find({ userId: new Types.ObjectId(userId) })
      .sort({ paymentDate: -1 })
      .populate('roomId', 'roomNumber');
  }
}
