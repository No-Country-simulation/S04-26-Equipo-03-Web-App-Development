import { ApiPropertyOptional } from '@nestjs/swagger';
import type { Json } from '../../types/database.types';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';
import { TalentAvailability } from './talent-availability.enum';

export class UpdateTalentProfileDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  location?: string;

  @ApiPropertyOptional({ enum: TalentAvailability })
  @IsOptional()
  @IsEnum(TalentAvailability)
  availability?: TalentAvailability;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(8000)
  bio?: string;

  @ApiPropertyOptional({
    description: 'Link portfolio (mutuamente excluyente con PDF en Cloudinary)',
  })
  @IsOptional()
  @IsUrl({ require_tld: false })
  portfolio_url?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(200)
  last_position?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(50)
  experience_years?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  age?: number;

  @ApiPropertyOptional({
    description:
      'Array JSON (educación múltiple Figma): institución, título, año',
  })
  @IsOptional()
  education?: Json;

  @ApiPropertyOptional({
    description:
      'JSON (array) experiencia laboral: company, role, description, from_month_year, to_month_year, current',
  })
  @IsOptional()
  work_experience?: Json;
}
