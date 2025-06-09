import { Controller, Get, Param } from '@nestjs/common';
import { CaptureService } from './capture.service';

@Controller('captures')
export class CaptureController {
  constructor(private readonly captureService: CaptureService) {}

  @Get()
  async getCaptures() {
    return this.captureService.getAllCaptures();
  }

  @Get('user/:userId')
  async getUserCaptures(@Param('userId') userId: string) {
    return this.captureService.getUserCaptures(userId);
  }

  // @Get('confidence')
  // async getAverageConfidencePerAnimal() {
  //   return this.captureService.getAverageConfidencePerAnimal();
  // }

  // @Get('confidence/animal/:animalId')
  // async getAverageConfidenceForAnimal(@Param('animalId') animalId: string) {
  //   return this.captureService.getAverageConfidenceForAnimal(animalId);
  // }

  // @Get('sightings/:animalId')
  // async getSightings(@Param('animalId') animalId: string) {
  //   return this.captureService.getSightings(animalId);
  // }
}
