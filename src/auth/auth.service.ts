import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User, UserDocument } from '../user/schema/user.schema'; 
import { MailService } from '../common/services/mail.service';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {

  changePassword(id: string, changePasswordDto: ChangePasswordDto) {
    throw new Error('Method not implemented.');
  }
  
  constructor(
    @InjectModel('User') private readonly userModel: Model<UserDocument>,
    private readonly mailService: MailService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(email: string, password: string): Promise<{ user: User; access_token: string } | null> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new UnauthorizedException('Invalid credentials');

    const access_token = await this.generateUserToken(user.id.toString());

    return {
      user: user.toObject() as User,
      access_token,
    };
  }

  async generatePasswordToken(id: string): Promise<User | null> {
    const user = await this.userModel.findById(id);

    if (!user) throw new UnauthorizedException('Invalid credentials');

    const token = randomBytes(4).toString('hex');

    user.token = token;

    await user.save();
    
    await this.mailService.sendPasswordResetEmail(user.email, token);

    return user;
  }

  private async generateUserToken(userId: string): Promise<string> {
    const expiresIn = this.configService.get<string>("JWT_ACCESS_EXPIRES_IN");

    return this.jwtService.sign(
      { sub: userId },
      { expiresIn },
    );
  }
}
