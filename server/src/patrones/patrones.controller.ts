import { Controller, Post, Get, Body } from '@nestjs/common';
import { PatronesServicio } from './patrones.servicio';

@Controller('patrones') // La ruta será http://localhost:3000/patrones
export class PatronesController {
  constructor(private readonly patronesServicio: PatronesServicio) {}

  @Post('guardar')
  async guardarNuevo(@Body() datos: any) {
    return this.patronesServicio.crearPatron(datos);
  }

  @Get('lista')
  async verTodos() {
    return this.patronesServicio.obtenerTodos();
  }
}