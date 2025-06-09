// image-processing.service.ts
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import * as FormData from 'form-data';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class ImageProcessingService {
  constructor(private readonly httpService: HttpService) {}

  async sendToPredictionAPI(file: Express.Multer.File): Promise<any> {
    const formData = new FormData();
    formData.append('file', file.buffer, {
      filename: file.originalname,
      contentType: file.mimetype,
    });

    const response$ = this.httpService.post('http://127.0.0.1:5000/prediction', formData, {
      headers: formData.getHeaders(),
    });

    const response = await lastValueFrom(response$);
    return response.data;
  }
}
