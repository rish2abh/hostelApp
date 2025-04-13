import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RoomsController } from './rooms.controller';
import { RoomsService } from './rooms.service';
import { Room, RoomSchema } from '../entities/room.entity';
import { IsRoomNumberUniqueConstraint } from './dto/custom-validator';
import { User, UserSchema } from 'src/entities/user.entity';
import { Bed, BedSchema } from 'src/entities/bed.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Room.name, schema: RoomSchema },
      { name: User.name, schema: UserSchema },
      { name: Bed.name, schema: BedSchema }
    ])
  ],
  controllers: [RoomsController],
  providers: [RoomsService, IsRoomNumberUniqueConstraint],
  exports: [RoomsService, IsRoomNumberUniqueConstraint]
})
export class RoomsModule {}
