import { Test, TestingModule } from '@nestjs/testing';
import { ImageProcessingController } from './image-processing.controller';
import { ImageProcessingService } from './image-processing.service';

describe('ImageProcessingController', () => {
  let controller: ImageProcessingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ImageProcessingController],
      providers: [ImageProcessingService],
    }).compile();

    controller = module.get<ImageProcessingController>(ImageProcessingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
