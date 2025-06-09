// src/common/services/mail.module.ts
import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule], // para usar o ConfigService
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
