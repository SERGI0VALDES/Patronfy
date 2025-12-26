import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'Patronfy_Secret_2025', // DEBE ser la misma que en AuthModule
    });
  } 

  async validate(payload: any) {
    // Lo que devuelvas aquí se guardará en request.user
    console.log('Token decodificado con éxito:', payload);
    return { id: payload.sub, email: payload.email };
  }
}