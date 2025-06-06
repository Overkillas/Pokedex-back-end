import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { AppModule } from './app.module';
import { JwtAuthGuard } from './common/guards/auth.guard'; 

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  const jwtGuard = new JwtAuthGuard(app.get(JwtService));

  app.useGlobalGuards(jwtGuard);

  await app.listen(3000);
}
bootstrap();
