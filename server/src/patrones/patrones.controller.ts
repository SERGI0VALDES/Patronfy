import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { PatronesServicio } from './patrones.service';
import { AuthGuard } from '@nestjs/passport';


@Controller('patrones') // La ruta será http://localhost:3000/patrones
export class PatronesController {
  constructor(private readonly patronesServicio: PatronesServicio) {}

  // Ruta protegida para guardar un nuevo patrón
  @UseGuards(AuthGuard('jwt')) // <-- ¡EL CANDADO!

  @Post('guardar')
  async guardar(@Body() datos: any, @Request() req) {
    // Ahora el usuario ID viene dentro del TOKEN, no necesitas enviarlo en el body
    const usuarioId = req.user.userId;
    return this.patronesServicio.crearPatron({ ...datos, usuarioId });
  }

  // Ruta protegida para obtener los patrones del usuario autenticado
  @UseGuards(AuthGuard('jwt'))

  @Get('mis-patrones')
  async obtenerMisPatrones(@Request() req) {
    // El ID viene del token, por seguridad
    const usuarioId = req.user.userId;
    return this.patronesServicio.obtenerPorUsuario(usuarioId);
  }

  @Get('lista')
  async verTodos() {
    return this.patronesServicio.obtenerTodos();
  }
}