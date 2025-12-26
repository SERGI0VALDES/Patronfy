// src/patrones/patrones.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaServicio } from '../prisma.service'; // Ajusta la ruta a tu PrismaService
import { CreatePatronDto } from './dto/create-patrone.dto';

@Injectable()
export class PatronesService {

  // Inyectamos el PrismaServicio para interactuar con la base de datos
  constructor(private prisma: PrismaServicio) {}

  async crear(usuarioId: string, dto: CreatePatronDto) {
  return this.prisma.patron.create({
      data: {
        ...dto,
        usuarioId: usuarioId, // Unimos los datos del formulario con el dueño del token
      },
    });
  }
  async obtenerPorUsuario(usuarioId: string) {
    return this.prisma.patron.findMany({
      where: {
        usuarioId: usuarioId,
      },
      orderBy: { 
        fechaCreacion: 'desc' },
    });
  }
}