// src/patrones/patrones.controller.ts
import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { PatronesService } from './patrones.service';
import { CreatePatronDto } from './dto/create-patrone.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // Guard de JWT

@Controller('patrones')
export class PatronesController {
  constructor(private readonly patronesService: PatronesService) {}

  // Ruta protegida
  @UseGuards(JwtAuthGuard)
  @Post()
  async crear(@Request() req, @Body() createPatronDto: CreatePatronDto) {

    console.log('Usuario en request:', req.user);
    // El usuarioId se extrae del token JWT (seguridad total)
    const usuarioId = req.user.id; 
    return this.patronesService.crear(usuarioId, createPatronDto);
  }

  // Ruta protegida para obtener patrones del usuario logueado
  @UseGuards(JwtAuthGuard)
  @Get()
  async obtenerTodos(@Request() req) {
    // idUsuariologeado para todo el que necesite el ID del usuario logueado
    const idUsuariolog = req.user.id;
    // Log util para debuguear
    console.log('Usuario logueado con ID:', idUsuariolog , 'Solicita sus patrones.');
    // Retornamos los patrones del usuario logueado
    return this.patronesService.obtenerPorUsuario(idUsuariolog);
  }
}