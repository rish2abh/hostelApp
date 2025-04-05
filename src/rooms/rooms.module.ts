import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RoomsController } from './rooms.controller';
import { RoomsService } from './rooms.service';
import { Room, RoomSchema } from '../entities/room.entity';
import { IsRoomNumberUniqueConstraint } from './dto/custom-validator';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Room.name, schema: RoomSchema }])
  ],
  controllers: [RoomsController],
  providers: [RoomsService, IsRoomNumberUniqueConstraint],
  exports: [RoomsService, IsRoomNumberUniqueConstraint]
})
export class RoomsModule {}
