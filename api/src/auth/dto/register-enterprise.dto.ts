import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
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
    example: 'secreto123',
    description: 'Contraseña (mínimo 8 caracteres)',
    minLength: 8,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password!: string;
}
