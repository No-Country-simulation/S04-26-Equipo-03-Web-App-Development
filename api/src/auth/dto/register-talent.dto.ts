import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterTalentDto {
  @ApiProperty({ example: 'Juan', description: 'Nombre' })
  @IsString()
  @IsNotEmpty()
  first_name!: string;

  @ApiProperty({ example: 'Pérez', description: 'Apellido' })
  @IsString()
  @IsNotEmpty()
  last_name!: string;

  @ApiProperty({ example: 'juan@gmail.com', description: 'Correo electrónico' })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({
    example: 'secreto123',
    description: 'Contraseña (mínimo 8 caracteres)',
    minLength: 8,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password!: string;
}
