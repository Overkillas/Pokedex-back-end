import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User, UserDocument } from '../user/schema/user.schema';
import { MailService } from '../common/services/mail.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { authenticator } from 'otplib';
import { randomBytes } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<UserDocument>,
    private readonly mailService: MailService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(
    email: string,
    password: string,
  ): Promise<{ user: User; access_token: string } | null> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      throw new UnauthorizedException('Invalid credentials');

    const access_token = await this.generateUserToken(user.id.toString());

    return {
      user: user.toObject() as User,
      access_token,
    };
  }

  generateTotpToken(email: string): string {
    const secret = this.getSecretForUser(email);
    authenticator.options = {
      step: 1800,
    };
    return authenticator.generate(secret);
  }

  validateTotpToken(email: string, token: string): boolean {
    const secret = this.getSecretForUser(email);
    return authenticator.check(token, secret);
  }

  private getSecretForUser(email: string): string {
    const secretBase = this.configService.get('TOTP_SECRET');
    return secretBase + ':' + email;
  }

  async sendTotpTokenByEmail(email: string): Promise<void> {
    const token = this.generateTotpToken(email);
    await this.mailService.sendTokenEmail(email, token);
  }

  async verifyTokenAndCreateUser(
    email: string,
    token: string,
    password: string,
    name: string,
  ): Promise<User> {
    const isValid = this.validateTotpToken(email, token);
    if (!isValid) throw new UnauthorizedException('Token inválido ou expirado');

    const existing = await this.userModel.findOne({ email });
    if (existing) throw new UnauthorizedException('Usuário já existe');

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new this.userModel({
      email,
      password: hashedPassword,
      name,
    });

    const saved = await newUser.save();
    return saved.toObject() as User;
  }

  async generatePasswordToken(email: string): Promise<User | null> {
    const user = await this.userModel.findOne({ email });

    if (!user) throw new UnauthorizedException('Invalid credentials');

    const token = randomBytes(4).toString('hex');

    // const token = randomInt(0, 1_000_000).toString().padStart(6, '0');
    user.token = token;

    await user.save();

    await this.mailService.sendTokenEmail(email, token);

    return user;
  }

  private generateUserToken(userId: string): string {
    const expiresIn = this.configService.get<string>('JWT_ACCESS_EXPIRES_IN');

    return this.jwtService.sign({ sub: userId }, { expiresIn });
  }
}
