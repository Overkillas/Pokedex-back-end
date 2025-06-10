import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/user/schema/user.schema';
import { Animal } from 'src/animal/schema/animal.schema';

export type CaptureDocument = Capture & Document;

@Schema()
export class Capture {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId | User;

  @Prop({ type: Types.ObjectId, ref: 'Animal', required: true })
  animal: Types.ObjectId | Animal;

  @Prop({ required: true })
  confidence: number;

  @Prop({ default: Date.now })
  capturedAt: Date;

  // Adicionar pontos aqui por captura 
  // (considerando a quantidade deles capturados por esse usuario e sightings total do animal, como modificadores nos pontos)

  @Prop()
  points?: number;
}

export const CaptureSchema = SchemaFactory.createForClass(Capture);
