// image-processing.service.ts
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as FormData from 'form-data';
import { CaptureService } from 'src/capture/capture.service';

@Injectable()
export class ImageProcessingService {
  constructor(private readonly captureService: CaptureService) {}

  async sendToPredictionAPI(file: Express.Multer.File): Promise<any> {
    const formData = new FormData();
    formData.append('file', file.buffer, {
      filename: file.originalname,
      contentType: file.mimetype,
    });

    const response = await axios.post(
      'https://classificationmodel-production.up.railway.app/prediction',
      formData,
      {
        headers: formData.getHeaders(),
        maxBodyLength: Infinity, // evita erros com arquivos grandes
      }
    );

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
