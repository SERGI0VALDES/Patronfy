import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  // Esta ruta será: POST http://localhost:3000/usuarios/registro
  @Post('registro')
  async crear(@Body() datos: any) {
    console.log('--- ¡LLEGÓ UNA PETICIÓN DE REGISTRO! ---');
    return this.usuariosService.crearUsuario(datos);
  }

  // Esta ruta será: GET http://localhost:3000/usuarios/correo/test@test.com
  // Útil para verificar si un usuario existe
  @Get('correo/:email')
  async buscarPorEmail(@Param('email') email: string) {
    return this.usuariosService.buscarPorCorreo(email);
  }

  // Buscamos por ID (UUID)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.usuariosService.findOne(id);
  }
}