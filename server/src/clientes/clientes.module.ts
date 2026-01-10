import { Module } from '@nestjs/common';
import { ClientesService } from './clientes.service';
import { ClientesController } from './clientes.controller';
import { PrismaServicio } from '../prisma.service';

@Module({
  controllers: [ClientesController],
  providers: [ClientesService, PrismaServicio],
})
export class ClientesModule {}
