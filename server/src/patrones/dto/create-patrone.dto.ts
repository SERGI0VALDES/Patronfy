import { IsString, IsNotEmpty, IsObject, IsOptional, IsNumber } from 'class-validator';

export class CreatePatronDto {
  @IsString()
  @IsNotEmpty()
  id_local: string;

  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  categoria: string;

  @IsObject()
  @IsNotEmpty()
  medidas: any;

  @IsOptional() @IsString()
  nombreCliente?: string;

  @IsOptional() @IsString()
  tipoPrenda?: string;

  @IsOptional() @IsNumber()
  totalTela?: number;

  @IsOptional() @IsString()
  dificultad?: string;

  @IsOptional()
  piezas?: any;

  @IsOptional()
  instrucciones?: any;

  @IsOptional()
  estiloPrenda?: any;
}