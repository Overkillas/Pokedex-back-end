import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AnimalDocument = Animal & Document;

@Schema()
export class Animal {
  @Prop({ required: true, unique: true })
  name: string;
}

export const AnimalSchema = SchemaFactory.createForClass(Animal);
