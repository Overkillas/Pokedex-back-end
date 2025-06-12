import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    const publicPaths = [
      '/auth/login',
      '/auth/send-totp-token',
      '/users/create',
      '/auth/generate-token',
      '/users/change-password',
    ];

    if (publicPaths.some(path => request.url.startsWith(path))) {
      return true;
    }


    const authHeader = request.headers['authorization'];
    if (!authHeader) {
      throw new UnauthorizedException('Token não fornecido');
    }

    const [, token] = authHeader.split(' ');

    if (!token) {
      throw new UnauthorizedException('Token inválido');
    }

    try {
      const payload = this.jwtService.verify(token);
      request.user = payload;
      return true;
    } catch (err) {
      throw new UnauthorizedException('Token inválido ou expirado');
    }
  }
}
