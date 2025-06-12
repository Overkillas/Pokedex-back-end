import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;
  private readonly mailUser: string;

  constructor(private configService: ConfigService) {
    this.mailUser = this.configService.get<string>('mailer.user')!;
    const mailPass = this.configService.get<string>('mailer.pass');

    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.mailUser,
        pass: mailPass,
      },
    });
  }

  async sendTokenEmail(userMail: string, token: string): Promise<void> {
    const mailOptions = {
      from: `"Desafio I.A." <${this.mailUser}>`,
      to: userMail,
      subject: 'Recuperação de Senha',
      html: `
        <p>Você solicitou um token.</p>
        <p>Cole o seguinte token para confirmar sua identidade:</p>
        <h2>${token}</h2>
        <p>Se você não solicitou isso, ignore este e-mail.</p>
      `,
    };

    await this.transporter.sendMail(mailOptions);
  }
}
