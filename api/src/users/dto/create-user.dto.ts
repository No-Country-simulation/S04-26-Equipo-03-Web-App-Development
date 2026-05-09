import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';
import { UserRole } from '../enums/user-role.enum';

export class CreateUserDto {
  @ApiProperty({ example: 'Juan', description: 'Nombre del usuario' })
  @IsString()
  @IsNotEmpty()
  first_name!: string;

  @ApiProperty({ example: 'Pérez', description: 'Apellido del usuario' })
  @IsString()
  @IsNotEmpty()
  last_name!: string;

  @ApiProperty({ example: 'juan@email.com', description: 'Correo electrónico' })
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

  @ApiProperty({
    enum: UserRole,
    example: UserRole.TALENT,
    description: 'Rol del usuario',
  })
  @IsEnum(UserRole)
  @IsNotEmpty()
  role!: UserRole;
}
