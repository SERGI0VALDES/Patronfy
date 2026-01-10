import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateClienteDto {
  @IsString()
  @IsOptional()
  nombre: string;

  @IsEmail()
  correo: string;

  @IsString()
  telefono: string;

  @IsString()
  @IsOptional()
  notas: string;
}