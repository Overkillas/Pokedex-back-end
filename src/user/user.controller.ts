import { Controller, Get, Post, Body, Patch, Param, Delete, UnauthorizedException } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from '../auth/dto/change-password.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/create/:token')
  create(@Param('token') token: string, @Body() createUserDto: CreateUserDto) {
    return this.userService.create(token, createUserDto);
  }


  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Patch('change-password/:token')
  changePassword(@Param('token') id: string, @Body() changePasswordDto: ChangePasswordDto){
    return this.userService.changePassword(id, changePasswordDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) { 
    return this.userService.remove(id);
  }
}
