import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schema/user.schema';
import { ChangePasswordDto } from '../auth/dto/change-password.dto'
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {

    const hashedPassword = await encryptPassword(createUserDto.password);

    const userToCreate = {
      ...createUserDto,
      password: hashedPassword,
    };

    const createdUser = new this.userModel(userToCreate);
    const savedUser = await createdUser.save();

    return savedUser.toObject() as User;
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findOne(id: string): Promise<User | null> {
    return this.userModel.findById(id).exec();
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User | null> {
    return this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true }).exec();
  }

  async remove(id: string): Promise<User | null> {
    return this.userModel.findByIdAndDelete(id).exec();
  }

  async changePassword(id: string, changePasswordDto: ChangePasswordDto): Promise<User | null> {
    const user = await this.userModel.findById(id).select('+token');

    if (!user) {
      // user not found exception
      return null;
    }
    console.log(changePasswordDto.token + " " + user.token)
    if(changePasswordDto.token != user.token){
      // invalid token exception
      return null;
    }
    
    const hashedPassword = await encryptPassword(changePasswordDto.password);

    user.password = hashedPassword;

    await user.save();

    return user;
  }
}

async function encryptPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

