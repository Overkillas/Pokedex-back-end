import { User, UserDocument } from "src/user/schema/user.schema";
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';


@Injectable()
export class UserProgressService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async updateUserLevel(userId: string, totalPoints: number): Promise<void> {
    const user = await this.userModel.findById(userId);
    if (!user) return;

    const nextLevel = this.calculateLevel(totalPoints);
    if (nextLevel > user.level) {
      user.level = nextLevel;
      await user.save();
    }
  }

  private calculateLevel(points: number): number {
    let level = 1;
    const MAX_POINTS = 5000;

    while (this.requiredPointsForLevel(level + 1) <= points && this.requiredPointsForLevel(level + 1) <= MAX_POINTS) {
      level++;
    }

    return level;
  }

  private requiredPointsForLevel(level: number): number {
    return level * 300;
  }
}

