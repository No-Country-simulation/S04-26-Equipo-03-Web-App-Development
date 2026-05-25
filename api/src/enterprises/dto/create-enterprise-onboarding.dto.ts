import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MinLength,
} from 'class-validator';

export class CreateEnterpriseOnboardingDto {
  @ApiProperty({ example: 'Juan', description: 'Nombre del responsable' })
  @IsString()
  @IsNotEmpty()
  first_name!: string;

  @ApiProperty({ example: 'Pérez', description: 'Apellido del responsable' })
  @IsString()
  @IsNotEmpty()
  last_name!: string;

  @ApiProperty({ example: 'Acme Corp', description: 'Nombre de la empresa' })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
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
    example: 'tecnologia',
    description: 'Industria de la empresa',
    required: false,
  })
  @IsString()
  @IsOptional()
  industry?: string;

  @ApiProperty({
    example: '11-50',
    description: 'Tamaño de la empresa',
    required: false,
  })
  @IsString()
  @IsOptional()
  size?: string;
}
