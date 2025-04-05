import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BedsController } from './beds.controller';
import { BedsService } from './beds.service';
import { Bed, BedSchema } from '../entities/bed.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Bed.name, schema: BedSchema }])
  ],
  controllers: [BedsController],
  providers: [BedsService],
  exports: [BedsService]
})
export class BedsModule {}
