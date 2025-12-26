// src/patrones/dto/create-patrone.dto.ts
import { IsString, IsNotEmpty, IsObject, IsUUID, IsOptional } from 'class-validator';

export class CreatePatronDto {
  @IsString()
  @IsNotEmpty()
  id_local: string; // El UUID generado por el celular

  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  categoria: string;

  @IsObject()
  @IsNotEmpty()
  medidas: any; // Validamos que sea un objeto, Prisma se encarga de convertirlo a JSON
}