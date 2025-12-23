import { Injectable } from '@nestjs/common';
import { PrismaServicio } from '../prisma.service';

@Injectable()
export class PatronesServicio {
  constructor(private prisma: PrismaServicio) {}

 async crearPatron(datos: any) {
    return this.prisma.patron.create({
      data: {
        id_local: datos.id_local,
        nombre: datos.nombre,
        categoria: datos.categoria,
        medidas: datos.medidas, // Prisma se encarga de convertir el objeto a JSON de Postgres
        usuario: {
          connect: { id: datos.usuarioId } // Esto asegura que busque al usuario existente
        }
      },
    });
  }

  async obtenerTodos() {
    return this.prisma.patron.findMany();
  }

  // Método para obtenre patrones por usuario
  async obtenerPorUsuario(usuarioId: string) {
  return this.prisma.patron.findMany({
      where: { usuarioId }, // Filtro: solo los míos
      orderBy: { fechaCreacion: 'desc' } // Los más nuevos primero
    });
  }

}