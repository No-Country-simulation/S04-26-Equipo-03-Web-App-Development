import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  IsUUID,
} from 'class-validator';
import { TalentAvailability } from './talent-availability.enum';

export class CreateTalentRegisterDto {
  @ApiPropertyOptional({ example: 'Juan' })
  @IsString()
  @IsNotEmpty()
  first_name!: string;

  @ApiPropertyOptional({ example: 'Pérez' })
  @IsString()
  @IsNotEmpty()
  last_name!: string;

  @ApiPropertyOptional({ example: 'juan@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiPropertyOptional({
    example: 'secreto123',
    description: 'Contraseña (reglas fuertes)',
  })
  @IsString()
  @IsNotEmpty()
  @IsStrongPassword({
    minLength: 8,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 1,
    minLowercase: 1,
  })
  password!: string;

  @ApiPropertyOptional({ example: 'Buenos Aires, Argentina' })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({ enum: TalentAvailability })
  @IsOptional()
  @IsEnum(TalentAvailability)
  availability?: TalentAvailability;

  @ApiPropertyOptional({
    description:
      'JSON array de UUIDs de Account_Enterprise a ocultar (multipart o JSON)',
    example: '["uuid-1","uuid-2"]',
  })
  @IsOptional()
  @Transform(({ value }): string[] | undefined => {
    if (value === undefined || value === null || value === '') {
      return undefined;
    }
    if (Array.isArray(value)) {
      return value.filter((x): x is string => typeof x === 'string');
    }
    if (typeof value === 'string') {
      try {
        const parsed: unknown = JSON.parse(value);
        if (!Array.isArray(parsed)) {
          return undefined;
        }
        return parsed.filter((x): x is string => typeof x === 'string');
      } catch {
        return undefined;
      }
    }
    return undefined;
  })
  @IsArray()
  @IsUUID('4', { each: true })
  blocked_enterprise_ids?: string[];
}
