import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Capture, CaptureDocument } from './schema/capture.schema';
import { Model, Types } from 'mongoose';
import { Animal, AnimalDocument } from 'src/animal/schema/animal.schema';

@Injectable()
export class CaptureService {
  constructor(
    @InjectModel(Capture.name) private captureModel: Model<CaptureDocument>,
    @InjectModel(Animal.name) private animalModel: Model<AnimalDocument>,
  ) {}

  // async captureAnimal(userId: string, animalName: string, confidence: number) {
  //   let animal = await this.animalModel.findOne({ name: animalName });
  //   if (!animal) {
  //     animal = new this.animalModel({ name: animalName });
  //     await animal.save();
  //   }

  //   const capture = new this.captureModel({
  //     user: userId,
  //     animal: animal._id,
  //     confidence: confidence,
  //     capturedAt: new Date(),
  //   });

  //   return capture.save();
  // }

  async getAllCaptures() {
    return this.captureModel.find().populate('user').populate('animal');
  }

  async getSightings(animalId: string) {
    const objectId = new Types.ObjectId(animalId);
  
    const count = await this.captureModel.countDocuments({ animal: objectId });
  
    return count;
  }

  async getUserCaptures(userId: string) {
    return this.captureModel.find({ user: userId }).populate('animal');
  }

  async getAverageConfidencePerAnimal() {
    return this.captureModel.aggregate([
      {
        $group: {
          _id: '$animal',
          avgConfidence: { $avg: '$confidence' },
        },
      },
      {
        $lookup: {
          from: this.animalModel.collection.name,
          localField: '_id',
          foreignField: '_id',
          as: 'animal',
        },
      },
      {
        $unwind: '$animal',
      },
      {
        $project: {
          animalId: '$_id',
          animalName: '$animal.name',
          averageConfidence: { $round: [{ $multiply: ['$avgConfidence', 100] }, 2] },
          _id: 0,
        },
      },
      {
        $sort: { averageConfidence: -1 },
      },
    ]);
  }
  

  async getAverageConfidenceForAnimal(animalId: string) {
    const result = await this.captureModel.aggregate([
      {
        $match: {
            animal: new Types.ObjectId(animalId),
        },
      },
      {
        $group: {
          _id: '$animal',
          averageConfidence: { $avg: '$confidence' },
        },
      },
      {
        $project: {
          _id: 0,
          animalId: '$_id',
          averageConfidence: { $round: [{ $multiply: ['$averageConfidence', 100] }, 2] },
        },
      },
    ]);
  
    return result[0] || { animalId, averageConfidence: null };
  }
  
  // -----------------------------------------------
  // -----------------------------------------------
  // -----------------------------------------------
  //             VERSÃO COM PONTOS
  // -----------------------------------------------
  // -----------------------------------------------
  // ----------------------------------------------- 

  async captureAnimal(userId: string, animalName: string, confidence: number) {
    if (animalName.toLowerCase() === 'uncertain') {
      return null;
    }

    let animal = await this.animalModel.findOne({ name: animalName });
    if (!animal) {
      animal = new this.animalModel({ name: animalName });
      await animal.save();
    }

    const animalId = animal._id;

    const userCaptures = await this.captureModel.countDocuments({
      user: userId,
      animal: animalId,
    });

    const totalCapturesForAnimal = await this.captureModel.countDocuments({
      animal: animalId,
    });

    let rarity = 1;
    if (totalCapturesForAnimal <= 10) rarity = 3;
    else if (totalCapturesForAnimal <= 50) rarity = 2;
    
    const DECAY_PER_CAPTURE = 10;
    const basePoints = Math.max(20, 100 - (userCaptures * DECAY_PER_CAPTURE));
    const finalPoints = basePoints * rarity;

    const capture = new this.captureModel({
      user: userId,
      animal: animalId,
      confidence,
      capturedAt: new Date(),
      points: finalPoints,
    });

    return capture.save();
  }


  async getUserScoreDetails(userId: string): Promise<{ totalPoints: number, totalCaptures: number }> {
    const captures = await this.captureModel.find({ user: userId }, 'points');
    
    const totalPoints = Math.round(captures.reduce((sum, capture) => sum + (capture.points || 0), 0));
    
    return {
      totalPoints,
      totalCaptures: captures.length,
    };
  }
  
}
