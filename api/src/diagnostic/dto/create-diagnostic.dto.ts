import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsUUID } from 'class-validator';

export class CreateDiagnosticDto {
  @ApiProperty({ description: 'ID del perfil de talento' })
  @IsUUID('4')
  talent_profile_id!: string;

  @ApiPropertyOptional({
    description: 'Tipo de diagnóstico',
    enum: ['INITIAL_ONBOARDING', 'SKILL_VALIDATION'],
    default: 'INITIAL_ONBOARDING',
  })
  @IsOptional()
  @IsIn(['INITIAL_ONBOARDING', 'SKILL_VALIDATION'])
  type?: 'INITIAL_ONBOARDING' | 'SKILL_VALIDATION';

  @ApiPropertyOptional({
    description:
      'ID de la skill a validar. Requerido cuando type es SKILL_VALIDATION. El diagnóstico se enfoca exclusivamente en esta skill.',
    example: 'uuid-skill',
  })
  @IsOptional()
  @IsUUID('4')
  skill_id?: string;
}
