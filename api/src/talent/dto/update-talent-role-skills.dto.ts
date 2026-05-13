import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { plainToInstance, Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

export class SkillEntryDto {
  @ApiProperty({ example: 'uuid-de-la-skill' })
  @IsUUID('4')
  skill_id!: string;

  @ApiPropertyOptional({
    description: 'Autoevaluación del talento (1–10)',
    minimum: 1,
    maximum: 10,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
  self_rating?: number;
}

export class UpdateTalentRoleSkillsDto {
  @ApiProperty({ example: 'Product Designer' })
  @IsString()
  @IsNotEmpty()
  role_name!: string;

  /**
   * Se recibe siempre como JSON string en el campo de texto del multipart.
   * Ejemplo: '[{"skill_id":"uuid-1","self_rating":8},{"skill_id":"uuid-2"},{"skill_id":"uuid-3"}]'
   * La transformación a instancias de SkillEntryDto ocurre en el setter.
   */
  @ApiProperty({
    description:
      'JSON string con mínimo 3 skills. Cada elemento: { skill_id: UUID, self_rating?: 1-10 }',
    type: 'string',
    example:
      '[{"skill_id":"uuid-1","self_rating":8},{"skill_id":"uuid-2"},{"skill_id":"uuid-3"}]',
  })
  @IsArray()
  @ArrayMinSize(3)
  @ValidateNested({ each: true })
  @Type(() => SkillEntryDto)
  skills!: SkillEntryDto[];

  static deserializeSkills(raw: string): SkillEntryDto[] {
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return [];
    }
    if (!Array.isArray(parsed)) return [];
    return plainToInstance(SkillEntryDto, parsed);
  }
}
