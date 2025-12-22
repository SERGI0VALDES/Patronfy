import { Injectable } from '@nestjs/common';
import { PrismaServicio } from '../prisma.servicio';

@Injectable()
export class PatronesServicio {
  constructor(private prisma: PrismaServicio) {}

  async crearPatron(datos: any) {
    return this.prisma.patron.create({
      data: {
        id_local: datos.id_local,
        nombre: datos.nombre,
        categoria: datos.categoria,
        medidas: datos.medidas, // Prisma maneja el JSON automáticamente
        usuarioId: datos.usuarioId,
      },
    });
  }

  async obtenerTodos() {
    return this.prisma.patron.findMany();
  }
}