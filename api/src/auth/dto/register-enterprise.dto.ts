import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { IsBusinessEmail } from '../../common/is-business-email.validator';

export class RegisterEnterpriseDto {
  @ApiProperty({
    example: 'contacto@empresa.com',
    description: 'Email corporativo (no se aceptan cuentas personales)',
  })
  @IsEmail()
  @IsNotEmpty()
  @IsBusinessEmail()
  email!: string;

  @ApiProperty({
    example: 'Secreto123',
    description:
      'Contraseña (mín. 8 caracteres, 1 mayúscula, 1 minúscula, 1 número)',
    minLength: 8,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
    message:
      'La contraseña debe contener al menos una mayúscula, una minúscula y un número',
  })
  password!: string;
}
