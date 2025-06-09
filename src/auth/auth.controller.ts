import { Body, Controller, Param, Patch, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/loginDTO';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.login(loginDto.email, loginDto.password);

    if (!user) {
      throw new UnauthorizedException('Email ou senha inválidos');
    }

    return user;
  }
  
  @Patch('generate-token')
  generatePasswordToken(@Body('email') email: string){
    return this.authService.generatePasswordToken(email);
  }
}