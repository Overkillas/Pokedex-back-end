import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CaptureService } from './capture.service';
import { Capture, CaptureSchema } from './schema/capture.schema';
import { Animal, AnimalSchema } from 'src/animal/schema/animal.schema';
import { CaptureController } from './capture.controller';
import { UserProgressModule } from 'src/user-progress/user-progress.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Capture.name, schema: CaptureSchema },
      { name: Animal.name, schema: AnimalSchema },
    ]),
    UserProgressModule,
  ],
  controllers: [CaptureController],
  providers: [CaptureService],
  exports: [CaptureService],
})
export class CaptureModule {}
