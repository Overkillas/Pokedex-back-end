import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ unique: true, required: true })
  email: string;

  @Prop()
  password: string;

  @Prop({ required: false, select: false })
  token?: string;

  @Prop({required: false, default: 1})
  level: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
