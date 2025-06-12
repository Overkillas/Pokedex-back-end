import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

export class ChangePasswordDto extends PartialType(CreateUserDto) {
    email: string
    password: string
}