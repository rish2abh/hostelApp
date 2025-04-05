import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BedsController } from './beds.controller';
import { BedsService } from './beds.service';
import { Bed, BedSchema } from '../entities/bed.entity';
import { Room, RoomSchema } from 'src/entities/room.entity';
import { User, UserSchema } from 'src/entities/user.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Bed.name, schema: BedSchema }]),
    MongooseModule.forFeature([{ name: Room.name, schema: RoomSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])
  ],
  controllers: [BedsController],
  providers: [BedsService],
  exports: [BedsService]
})
export class BedsModule {}
