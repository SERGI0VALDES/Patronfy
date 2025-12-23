import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsuariosModule } from '../usuarios/usuarios.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    UsuariosModule,
    PassportModule,
    JwtModule.register({
      global: true, // Lo hacemos global para no tener que importarlo en otros módulos
      secret: 'Patronfy_Secret_2025', // Cambiaremos esto después por una variable .env
      signOptions: { expiresIn: '5min' }, // El token durará 1 día
    }),
  ],    
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}