import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsIn,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export type SelfRatingLabel = 'no_lo_conozco' | 'lo_uso' | 'lo_domino';
export const SELF_RATING_LABELS: SelfRatingLabel[] = [
  'no_lo_conozco',
  'lo_uso',
  'lo_domino',
];

export class SkillRatingEntryDto {
  @ApiProperty({ example: 'uuid-de-la-skill' })
  @IsUUID('4')
  skill_id!: string;

  @ApiProperty({
    enum: SELF_RATING_LABELS,
    example: 'lo_uso',
    description:
      '"no_lo_conozco" → nivel 1-3 | "lo_uso" → nivel 4-6 | "lo_domino" → nivel 7-10',
  })
  @IsString()
  @IsIn(SELF_RATING_LABELS)
  self_rating!: SelfRatingLabel;
}

export class SaveSkillRatingsDto {
  @ApiProperty({ type: [SkillRatingEntryDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => SkillRatingEntryDto)
  ratings!: SkillRatingEntryDto[];
}
