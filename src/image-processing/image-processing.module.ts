import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ImageProcessingController } from './image-processing.controller';
import { ImageProcessingService } from './image-processing.service';

@Module({
  imports: [HttpModule],
  controllers: [ImageProcessingController],
  providers: [ImageProcessingService],
})
export class ImageProcessingModule {}
