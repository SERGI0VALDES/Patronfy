import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err, user, info, context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    
    // ESTO ES PARA DEBUGEAR:
    console.log('--- REVISANDO PETICIÓN ---');
    console.log('Header Authorization:', request.headers.authorization);
    
    if (err || !user) {
      console.log('Error de Auth:', info?.message || 'No se encontró usuario');
      throw err || new UnauthorizedException('-- EROR AUTH --');
    }
    return user;
  }
}