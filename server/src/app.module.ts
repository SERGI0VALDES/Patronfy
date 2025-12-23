import { Module } from '@nestjs/common';
import { PrismaServicio } from './prisma.service';
import { PatronesController } from './patrones/patrones.controller';
import { PatronesServicio } from './patrones/patrones.service';
import { AuthModule } from './auth/auth.module';
import { UsuariosModule } from './usuarios/usuarios.module';

@Module({
  imports: [AuthModule, UsuariosModule], // Importamos los módulos necesarios
  controllers: [PatronesController], // Agregamos el controlador
  providers: [PrismaServicio, PatronesServicio], // Agregamos el servicio
})

export class ModuloPrincipal {}