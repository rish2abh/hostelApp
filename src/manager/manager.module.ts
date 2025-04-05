import { Module } from '@nestjs/common';
import { ManagerService } from './manager.service';
import { ManagerController } from './manager.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Manager, ManagerSchema } from 'src/entities/managers.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports : [
        MongooseModule.forFeature([{ name: Manager.name, schema: ManagerSchema }]),
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
