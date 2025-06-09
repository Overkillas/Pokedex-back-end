import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageProcessingService } from './image-processing.service';

@Controller('image-processing')
export class ImageProcessingController {
  constructor(private readonly imageProcessingService: ImageProcessingService) {}

  @Post('/prediction')
  @UseInterceptors(FileInterceptor('file'))
  async create(@UploadedFile() file: Express.Multer.File) {
    return this.imageProcessingService.sendToPredictionAPI(file);
  }
}
