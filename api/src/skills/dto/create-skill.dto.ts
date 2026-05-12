import { IsEnum, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum SkillCategory {
  TECH = 'TECH',
  SOFT = 'SOFT',
  COGNITIVE = 'COGNITIVE',
}

export class CreateSkillDto {
  @ApiProperty({ example: 'TypeScript' })
  @IsString()
  @MinLength(1)
  title!: string;

  @ApiProperty({ enum: SkillCategory, example: SkillCategory.TECH })
  @IsEnum(SkillCategory)
  type!: SkillCategory;
}
