import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import databaseConfig from './config/database.config';
import { User, UserSchema } from './entities/user.entity';
import { Room, RoomSchema } from './entities/room.entity';
import { Payment, PaymentSchema } from './entities/payment.entity';
import { Expense, ExpenseSchema } from './entities/expense.entity';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RoomsModule } from './rooms/rooms.module';
import { BedsModule } from './beds/beds.module';
import { PaymentsModule } from './payments/payments.module';
import { ManagerModule } from './manager/manager.module';
import { ExpenseModule } from './expense/expense.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('database.uri'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Room.name, schema: RoomSchema },
      { name: Payment.name, schema: PaymentSchema },
      { name: Expense.name, schema: ExpenseSchema },
    ]),
    AuthModule,
    UsersModule,
    RoomsModule,
    BedsModule,
    PaymentsModule,
    ManagerModule,
    ExpenseModule,
    CommonModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
