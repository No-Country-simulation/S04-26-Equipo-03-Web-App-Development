import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MinLength,
} from 'class-validator';

export class RegisterEnterpriseDto {
  @ApiProperty({ example: 'Juan', description: 'Nombre del responsable' })
  @IsString()
  @IsNotEmpty()
  first_name!: string;

  @ApiProperty({ example: 'Pérez', description: 'Apellido del responsable' })
  @IsString()
  @IsNotEmpty()
  last_name!: string;

  @ApiProperty({
    example: 'empresa@gmail.com',
    description: 'Correo electrónico',
  })
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

  @ApiProperty({ example: 'Acme Corp', description: 'Nombre de la empresa' })
  @IsString()
  @IsNotEmpty()
  company_name!: string;

  @ApiProperty({
    example: 'https://acme.com',
    description: 'Sitio web de la empresa',
    required: false,
  })
  @IsUrl()
  @IsOptional()
  website_url?: string;

  @ApiProperty({
    example: 'Empresa de tecnología',
    description: 'Descripción de la empresa',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;
}
