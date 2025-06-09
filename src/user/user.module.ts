// src/user/user.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schema/user.schema';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MailModule } from '../common/services/mail.module'; 

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MailModule, // <-- adicione aqui
  ],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
