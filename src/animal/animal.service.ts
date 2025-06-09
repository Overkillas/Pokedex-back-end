import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Animal, AnimalDocument } from './schema/animal.schema';
import { CaptureService } from 'src/capture/capture.service';

@Injectable()
export class AnimalService {
  constructor(
    @InjectModel(Animal.name) private animalModel: Model<AnimalDocument>,
    private readonly captureService: CaptureService,
  ) {}

  async findAll() {
    const animals = await this.animalModel.find();
    const results = await Promise.all(
      animals.map(async (animal) => {
        const sightings = await this.captureService.getSightings(animal.id.toString());
        const confidenceData = await this.captureService.getAverageConfidenceForAnimal(animal.id.toString());

        return {
          name: animal.name,
          sightings,
          confidence: confidenceData.averageConfidence,
        };
      }),
    );

    return results;
  }

  async findOne(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error('Invalid animal id');
    }

    const animal = await this.animalModel.findById(id);
    if (!animal) {
      throw new Error('Animal not found');
    }

    const sightings = await this.captureService.getSightings(animal.id.toString());
    const confidenceData = await this.captureService.getAverageConfidenceForAnimal(animal.id.toString());

    return {
      name: animal.name,
      sightings,
      confidence: confidenceData.averageConfidence,
    };
  }

  // Métodos create, update, remove podem ser implementados normalmente
}
