import { Module } from '@nestjs/common';
import { PrismaServicio } from './prisma.servicio';
import { PatronesController } from './patrones/patrones.controller';
import { PatronesServicio } from './patrones/patrones.servicio';

@Module({
  imports: [],
  controllers: [PatronesController], // Agregamos el controlador
  providers: [PrismaServicio, PatronesServicio], // Agregamos el servicio
})

export class ModuloPrincipal {}