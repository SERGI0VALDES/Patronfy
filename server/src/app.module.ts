import { Module } from '@nestjs/common';
import { PrismaServicio } from './prisma.service';
import { PatronesController } from './patrones/patrones.controller';
import { PatronesService } from './patrones/patrones.service';
import { AuthModule } from './auth/auth.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { PatronesModule } from './patrones/patrones.module';

@Module({
  imports: [AuthModule, UsuariosModule, PatronesModule], // Importamos los módulos necesarios
  controllers: [PatronesController], // Agregamos el controlador
  providers: [PrismaServicio, PatronesService], // Agregamos el servicio
})

export class ModuloPrincipal {}