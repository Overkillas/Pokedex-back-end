import { Body, Controller,Post, Req, UploadedFile, UseInterceptors,} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageProcessingService } from './image-processing.service';

@Controller('image-processing')
export class ImageProcessingController {
  constructor(private readonly imageProcessingService: ImageProcessingService) {}

  @Post('/predict')
  @UseInterceptors(FileInterceptor('file'))
  async predict(@UploadedFile() file: Express.Multer.File) {
    return this.imageProcessingService.sendToPredictionAPI(file);
  }

  @Post('/capture')
  async capture(@Req() req: any, @Body() body: { prediction: string; confidence: number }) {
    const { prediction, confidence } = body;
    return this.imageProcessingService.capturePrediction(req.user.sub, prediction, confidence);
  }
}
