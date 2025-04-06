import { Module } from '@nestjs/common';
import { CloudinaryService } from './common.service';

@Module({
  controllers: [],
  providers: [CloudinaryService],
  exports : [CloudinaryService]
})
export class CommonModule {}
