import { Module } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { UsuariosController } from './usuarios.controller';
import { PrismaServicio } from '../prisma.service';

@Module({
  providers: [UsuariosService, PrismaServicio],
  controllers: [UsuariosController],
  exports: [UsuariosService], // <-- Esto es lo más importante ahora
})
export class UsuariosModule {}