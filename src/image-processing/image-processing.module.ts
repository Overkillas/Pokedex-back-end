// image-processing.module.ts
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ImageProcessingController } from './image-processing.controller';
import { ImageProcessingService } from './image-processing.service';
import { CaptureModule } from 'src/capture/capture.module';

@Module({
  imports: [HttpModule, CaptureModule],
  controllers: [ImageProcessingController],
  providers: [ImageProcessingService],
})
export class ImageProcessingModule {}
