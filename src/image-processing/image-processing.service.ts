// image-processing.service.ts
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import * as FormData from 'form-data';
import { lastValueFrom } from 'rxjs';
import { CaptureService } from 'src/capture/capture.service';

@Injectable()
export class ImageProcessingService {
  constructor(private readonly httpService: HttpService,
              private readonly captureService: CaptureService
  ) {}

  async sendToPredictionAPI(file: Express.Multer.File): Promise<any> {
    const formData = new FormData();
    formData.append('file', file.buffer, {
      filename: file.originalname,
      contentType: file.mimetype,
    });

    const response$ = this.httpService.post(
      'http://flask:5000/prediction',
      formData,
      { headers: formData.getHeaders() }
    );

    const response = await lastValueFrom(response$);
    return response.data;
  }

  async capturePrediction(userId: string, prediction: string, confidence: number) {
    await this.captureService.captureAnimal(userId, prediction, confidence);

    return {
      message: 'Captura registrada com sucesso',
      captured: prediction,
      confidence,
    };
  }
}


