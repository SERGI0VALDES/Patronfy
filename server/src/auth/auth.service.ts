import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsuariosService } from '../usuarios/usuarios.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usuariosService: UsuariosService,
    private jwtService: JwtService,
  ) {}

  async signIn(correo: string, pass: string): Promise<any> {
  console.log('--- INTENTO DE ACCESO ---');
  console.log('Correo recibido:', `"${correo}"`); // Las comillas ayudan a ver espacios vacíos
  console.log('Clave recibida:', `"${pass}"`);

  const usuario = await this.usuariosService.buscarPorCorreo(correo);
  
  if (!usuario) {
    console.log('Resultado: Usuario no encontrado en la DB');
    throw new UnauthorizedException('Credenciales incorrectas');
  }

  console.log('Usuario encontrado:', usuario.correo);
  
  const esCorrecta = await bcrypt.compare(pass, usuario.clave);
  console.log('¿La clave coincide con el hash?:', esCorrecta);

  if (esCorrecta) {
    const payload = { sub: usuario.id, email: usuario.correo };
    return {
      access_token: await this.jwtService.signAsync(payload),
      usuario: { nombre: usuario.nombre, correo: usuario.correo }
    };
  }
  
  throw new UnauthorizedException('Credenciales incorrectas');
  }
}