import { Module } from '@nestjs/common';
import { ManagerService } from './manager.service';
import { ManagerController } from './manager.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Manager, ManagerSchema } from 'src/entities/managers.entity';
import { JwtModule } from '@nestjs/jwt';
import { Expense, ExpenseSchema } from 'src/entities/expense.entity';
import { Payment, PaymentSchema } from 'src/entities/payment.entity';

@Module({
  imports : [
    MongooseModule.forFeature([
      { name: Manager.name, schema: ManagerSchema },
      { name: Expense.name, schema: ExpenseSchema },
      { name: Payment.name, schema: PaymentSchema }
    ]),
      
        JwtModule.register({
            secret: process.env.JWT_SECRET || 'your-secret-key', // Use env var in real apps
            signOptions: { expiresIn: '7d' }, // Customize as needed
          }),
  ],
  controllers: [ManagerController],
   providers: [ManagerService],
    exports: [ManagerService,JwtModule],
  
})
export class ManagerModule {}
