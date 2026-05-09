import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { UserRole } from '../enums/user-role.enum';

export class UpdateUserDto {
  @ApiProperty({
    example: 'Juan',
    description: 'Nombre del usuario',
    required: false,
  })
  @IsString()
  @IsOptional()
  first_name?: string;

  @ApiProperty({
    example: 'Pérez',
    description: 'Apellido del usuario',
    required: false,
  })
  @IsString()
  @IsOptional()
  last_name?: string;

  @ApiProperty({
    example: 'juan@email.com',
    description: 'Correo electrónico',
    required: false,
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({
    example: 'secreto123',
    description: 'Contraseña (mínimo 8 caracteres)',
    minLength: 8,
    required: false,
  })
  @IsString()
  @IsOptional()
  @MinLength(8)
  password?: string;

  @ApiProperty({
    enum: UserRole,
    example: UserRole.TALENT,
    description: 'Rol del usuario',
    required: false,
  })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;
}
