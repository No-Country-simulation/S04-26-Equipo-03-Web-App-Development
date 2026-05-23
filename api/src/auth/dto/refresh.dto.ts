import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshDto {
  @ApiProperty({ description: 'Token de renovación de sesión' })
  @IsString()
  @IsNotEmpty()
  refresh_token!: string;
}
