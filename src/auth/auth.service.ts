import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User, UserDocument } from '../user/schema/user.schema'; 
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class AuthService {
  changePassword(id: string, changePasswordDto: ChangePasswordDto) {
    throw new Error('Method not implemented.');
  }
  constructor(
    @InjectModel('User') private readonly userModel: Model<UserDocument>,
  ) {}

  async login(email: string, password: string): Promise<User | null> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return null;
    }

    return user.toObject() as User;
  }

  async generatePasswordToken(id: string): Promise<User | null> {
    const user = await this.userModel.findById(id);

    if (!user) {
      return null;
    }

    const token = randomBytes(4).toString('hex');

    user.token = token;

    await user.save();

    return user;
  }
}

