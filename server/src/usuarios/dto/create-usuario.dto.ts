import { IsString, IsNotEmpty, IsEmail, IsOptional } from 'class-validator';

export class CreateUsuarioDto {
  @IsOptional()
  @IsString()
  nombre?: string;

  @IsEmail({}, { message: 'El correo no es válido' })
  @IsNotEmpty({ message: 'El correo es obligatorio' })
  correo: string;

  @IsString()
  @IsNotEmpty({ message: 'La clave es obligatoria' })
  clave: string;
}