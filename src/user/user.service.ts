import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schema/user.schema';
import { ChangePasswordDto } from '../auth/dto/change-password.dto';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { CaptureService } from 'src/capture/capture.service';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly captureService: CaptureService,
    private readonly authService: AuthService,
  ) {}
  // test

  async create(token: string, createUserDto: CreateUserDto): Promise<User> {
    const { email, password } = createUserDto;

    const isValidToken = this.authService.validateTotpToken(email, token);
    if (!isValidToken) {
      throw new UnauthorizedException('Token inválido ou expirado');
    }

    const hashedPassword = await encryptPassword(password);

    const userToCreate = {
      ...createUserDto,
      password: hashedPassword,
    };

    const createdUser = new this.userModel(userToCreate);
    const savedUser = await createdUser.save();

    return savedUser.toObject() as User;
  }

  async findAll(): Promise<
    (User & { totalPoints: number; totalCaptures: number })[]
  > {
    const users = await this.userModel.find().exec();

    const usersWithScore = await Promise.all(
      users.map(async (user) => {
        const scoreDetails = await this.captureService.getUserScoreDetails(
          user.id.toString(),
        );

        return {
          ...user.toObject(),
          totalPoints: scoreDetails.totalPoints,
          totalCaptures: scoreDetails.totalCaptures,
        };
      }),
    );

    return usersWithScore;
  }

  async findOne(
    id: string,
  ): Promise<(User & { totalPoints: number; totalCaptures: number }) | null> {
    const user = await this.userModel.findById(id).exec();
    if (!user) return null;

    const scoreDetails = await this.captureService.getUserScoreDetails(id);

    return {
      ...user.toObject(),
      totalPoints: scoreDetails.totalPoints,
      totalCaptures: scoreDetails.totalCaptures,
    };
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User | null> {
    return this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<User | null> {
    return this.userModel.findByIdAndDelete(id).exec();
  }

  async changePassword(
    token: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<User | null> {
    const { email, password } = changePasswordDto;

    const user = await this.userModel.findOne({ email });
    if (!user) throw new UnauthorizedException('Usuário não encontrado');

    const isValidToken = this.authService.validateTotpToken(email, token);
    if (!isValidToken) {
      throw new UnauthorizedException('Token inválido ou expirado');
    }

    const hashedPassword = await encryptPassword(password);
    user.password = hashedPassword;
    await user.save();

    return user;
  }
}

async function encryptPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}
