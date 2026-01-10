import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaServicio } from '../prisma.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';

@Injectable()
export class ClientesService {
  constructor(private prisma: PrismaServicio) {}

  async create(createClienteDto: CreateClienteDto, usuarioId: string, foto?: Express.Multer.File) {
    return this.prisma.cliente.create({
      data: {
        ...createClienteDto,
        usuarioId: usuarioId,
        photoUri: foto ? `/uploads/${foto.filename}` : null,
      },
    });
  }

  async findAll(usuarioId: string) {
    return this.prisma.cliente.findMany({
      where: { usuarioId: usuarioId },
      orderBy: { fechaCreacion: 'desc' },
    });
  }

  async findOne(id: string) {
    const cliente = await this.prisma.cliente.findUnique({ where: { id } });
    if (!cliente) throw new NotFoundException('Cliente no encontrado');
    return cliente;
  }

  // 1. CORRECCIÓN: Ahora acepta la foto y procesa los datos correctamente
  async update(id: string, updateClienteDto: UpdateClienteDto, foto?: Express.Multer.File) {
    // Si hay una foto nueva, la añadimos al objeto de datos
    const dataToUpdate: any = { ...updateClienteDto };
    
    if (foto) {
      dataToUpdate.photoUri = `/uploads/${foto.filename}`;
    }

    try {
      return await this.prisma.cliente.update({
        where: { id },
        data: dataToUpdate,
      });
    } catch (error) {
      // Esto atrapa errores de duplicados (como el teléfono) o si el ID no existe
      throw new Error('Error al actualizar: El dato ya existe o el cliente no se encontró.');
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.cliente.delete({
        where: { id },
      });
    } catch (error) {
      throw new Error('El cliente no existe o no pudo ser eliminado');
    }
  }
}