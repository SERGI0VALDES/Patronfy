import { Injectable } from '@nestjs/common';
import { PrismaServicio } from '../prisma.service';
import { CreatePatronDto } from '../patrones/dto/create-patrone.dto';

@Injectable()
export class PatronesService {
  constructor(private prisma: PrismaServicio) {}

  async crear(usuarioId: string, dto: CreatePatronDto) {
    console.log('--- Intentando guardar patrón ---');
    console.log('Usuario:', usuarioId);
    console.log('ID Local:', dto.id_local);

    return this.prisma.patron.create({
      data: {
        ...dto, // Esparce automáticamente nombre, categoria, nombreCliente, etc.
        usuarioId: usuarioId, // El ID que viene del JWT
      },
    });
  }

  async obtenerPorUsuario(usuarioId: string) {
    return this.prisma.patron.findMany({
      where: { usuarioId },
      orderBy: { fechaCreacion: 'desc' },
    });
  }
}