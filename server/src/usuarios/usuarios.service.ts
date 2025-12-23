import { Injectable } from '@nestjs/common';
import { PrismaServicio } from '../prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuariosService {
  // Inyectamos Prisma para poder tocar la base de datos
  constructor(private prisma: PrismaServicio) {}

  // 1. Registro de usuario con clave encriptada
  async crearUsuario(datos: { nombre: string; correo: string; clave: string }) {

    // 1. Encriptar la clave antes de guardar
    const saltRounds = await bcrypt.genSalt(10);
    const hashedClave = await bcrypt.hash(datos.clave, saltRounds);

    return this.prisma.usuario.create({
      data: {
        nombre: datos.nombre,
        correo: datos.correo,
        clave: hashedClave,
      },
    });
  }

  // 2. Buscar por correo (Vital para el Login)
  async buscarPorCorreo(correo: string) {
    return this.prisma.usuario.findUnique({
      where: { correo },
    });
  }

  // 3. Opcional: Buscar por ID (Para cuando ya estén logueados)
  async findOne(id: string) {
    return this.prisma.usuario.findUnique({
      where: { id },
    });
  }
}