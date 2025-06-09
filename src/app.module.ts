import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ImageProcessingModule } from './image-processing/image-processing.module';
import { CaptureModule } from './capture/capture.module';
import { AnimalModule } from './animal/animal.module';
import config from './common/config/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('DB_URL', { infer: true }),
      }),
      inject: [ConfigService],
    }),
    UserModule,
    AuthModule,
    ImageProcessingModule,
    CaptureModule,
    AnimalModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
