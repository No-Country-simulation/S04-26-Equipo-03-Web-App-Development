import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class UpdateTalentRoleSkillsDto {
  @ApiProperty({ example: 'Product Designer' })
  @IsString()
  @IsNotEmpty()
  role_name!: string;

  @ApiPropertyOptional({
    description: 'Si se envía, reemplaza roles previos del perfil',
  })
  @IsOptional()
  @IsString()
  cv_url?: string;

  @ApiProperty({
    description: 'Mínimo 3 skill_id existentes en tabla Skill (Figma stack)',
    type: [String],
    minItems: 3,
  })
  @IsArray()
  @ArrayMinSize(3)
  @IsUUID('4', { each: true })
  skill_ids!: string[];
}
