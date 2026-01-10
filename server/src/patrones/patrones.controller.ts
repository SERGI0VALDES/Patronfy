// src/patrones/patrones.controller.ts
import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { PatronesService } from './patrones.service';
import { CreatePatronDto } from './dto/create-patrone.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // Guard de JWT
import { Patch, Delete, Param } from '@nestjs/common';

@Controller('patrones')
export class PatronesController {
  constructor(private readonly patronesService: PatronesService) {}

  // Ruta protegida
  @UseGuards(JwtAuthGuard)
  @Post()
  async crear(@Request() req, @Body() createPatronDto: CreatePatronDto) {
    // 1. Corregimos el log para usar 'id' que es lo que viene del Token
    console.log('--- INTENTO DE CREAR PATRÓN ---');
    console.log('ID del Usuario logueado:', req.user.id); 
    console.log('Datos que envió el celular:', createPatronDto);

    const usuarioId = req.user.id; 
    
    try {
      return await this.patronesService.crear(usuarioId, createPatronDto);
    } catch (error) {
      console.log('Error en el servicio al crear:', error.message);
      throw error;
    }
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

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async actualizar(
    @Param('id') id: string,
    @Body() updateDto: Partial<CreatePatronDto>
  ) {
    return this.patronesService.actualizar(id, updateDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async eliminar(@Param('id') id: string) {
    return this.patronesService.eliminar(id);
  }
}