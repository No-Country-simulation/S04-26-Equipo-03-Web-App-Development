import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';

type AuthLikeError = {
  message: string;
  status?: number;
  code?: string;
};

/**
 * Convierte errores típicos de `auth.signUp` en HTTP 4xx en lugar de 500.
 */
export function throwFromAuthSignUpError(error: AuthLikeError): never {
  const raw = error.message ?? '';
  const msg = raw.toLowerCase();

  if (
    msg.includes('already registered') ||
    msg.includes('already been registered') ||
    msg.includes('user already exists') ||
    msg.includes('email address is already') ||
    msg.includes('email already') ||
    (msg.includes('duplicate') && msg.includes('email'))
  ) {
    throw new ConflictException(
      'Ya existe una cuenta registrada con este correo electrónico.',
    );
  }

  if (
    msg.includes('invalid email') ||
    msg.includes('invalid login credentials')
  ) {
    throw new BadRequestException(raw);
  }

  if (
    msg.includes('password') &&
    (msg.includes('weak') ||
      msg.includes('short') ||
      msg.includes('least') ||
      msg.includes('characters'))
  ) {
    throw new BadRequestException(raw);
  }

  if (error.status === 422) {
    throw new BadRequestException(raw);
  }

  throw new InternalServerErrorException(raw);
}
