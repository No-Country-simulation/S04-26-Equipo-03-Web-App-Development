import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsIn,
  IsInt,
  IsPositive,
  ValidateNested,
} from 'class-validator';

export class QuestionResponseDto {
  @ApiProperty({ description: 'ID de la pregunta generada', example: 1 })
  @IsInt()
  @IsPositive()
  question_id!: number;

  @ApiProperty({
    description: 'Opción seleccionada',
    enum: ['a', 'b', 'c', 'd'],
    example: 'b',
  })
  @IsIn(['a', 'b', 'c', 'd'])
  selected_option!: 'a' | 'b' | 'c' | 'd';
}

export class SubmitResponsesDto {
  @ApiProperty({
    description: 'Array con una respuesta por cada pregunta generada',
    type: [QuestionResponseDto],
    example: [
      { question_id: 1, selected_option: 'b' },
      { question_id: 2, selected_option: 'a' },
    ],
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => QuestionResponseDto)
  responses!: QuestionResponseDto[];
}
