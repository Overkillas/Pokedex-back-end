// animal.module.ts
import { Module } from '@nestjs/common';
import { AnimalService } from './animal.service';
import { AnimalController } from './animal.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Animal, AnimalSchema } from './schema/animal.schema';
import { CaptureModule } from 'src/capture/capture.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Animal.name, schema: AnimalSchema },
    ]),
    CaptureModule,
  ],
  controllers: [AnimalController],
  providers: [AnimalService],
})
export class AnimalModule {}
