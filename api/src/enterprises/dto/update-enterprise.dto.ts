import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdateEnterpriseDto {
  @ApiProperty({
    example: 'Acme Corp',
    description: 'Nombre de la empresa',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    example: 'https://acme.com',
    description: 'Sitio web de la empresa',
    required: false,
  })
  @IsUrl()
  @IsOptional()
  website_url?: string;

  @ApiProperty({
    example: 'Empresa líder en tecnología',
    description: 'Descripción de la empresa',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;
}
