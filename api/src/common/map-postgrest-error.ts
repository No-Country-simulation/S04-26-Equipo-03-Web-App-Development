import {
  BadRequestException,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';

export type PostgrestLikeError = {
  message?: string;
  code?: string;
  details?: string;
  hint?: string;
};

/** Columna inexistente o caché de esquema de PostgREST desactualizado. */
export function isPostgrestMissingColumnOrSchemaCacheError(
  err: PostgrestLikeError,
): boolean {
  const msg = (err.message ?? '').toLowerCase();
  return (
    (msg.includes('schema cache') && msg.includes('column')) ||
    (msg.includes('could not find') && msg.includes('column')) ||
    (msg.includes('column') && msg.includes('does not exist'))
  );
}

/**
 * Errores de PostgREST cuando el código espera columnas que no existen o el caché de esquema está viejo.
 */
export function throwMappedPostgrestError(err: PostgrestLikeError): never {
  const msg = err.message ?? '';
  const lower = msg.toLowerCase();

  if (isPostgrestMissingColumnOrSchemaCacheError(err)) {
    throw new HttpException(
      {
        statusCode: HttpStatus.SERVICE_UNAVAILABLE,
        error: 'DatabaseSchemaMismatch',
        message:
          'La base no coincide con lo que espera la API: falta una columna en Talent_profile o PostgREST aún no refrescó el esquema.',
        detail: msg,
        fix: [
          '1) En Supabase → SQL Editor, ejecutá el archivo api/supabase/migrations/20260511120000_extend_talent_profile_onboarding.sql',
          "2) Si el error sigue, en SQL Editor ejecutá: NOTIFY pgrst, 'reload schema';",
          '3) O esperá unos segundos y reintentá (a veces el caché de esquema tarda).',
        ],
      },
      HttpStatus.SERVICE_UNAVAILABLE,
    );
  }

  /** PostgreSQL foreign_key_violation */
  const fkViolation =
    err.code === '23503' ||
    (lower.includes('violates foreign key constraint') &&
      lower.includes('foreign key'));

  if (fkViolation) {
    let userMessage =
      'Los datos enviados referencian un registro que no existe en la base (clave foránea).';
    if (
      msg.includes('Enterprise_black_list') &&
      (msg.includes('enterprise_id') || lower.includes('enterprise_id'))
    ) {
      userMessage =
        'Cada valor en blocked_enterprise_ids debe ser el id (UUID) de una empresa que ya exista en Account_Enterprise. Si no tenés esos ids, omití blocked_enterprise_ids o usá solo empresas registradas.';
    }
    throw new BadRequestException({
      statusCode: HttpStatus.BAD_REQUEST,
      error: 'ForeignKeyViolation',
      message: userMessage,
      detail: msg,
      postgresCode: err.code,
    });
  }

  throw new InternalServerErrorException(msg || 'Error de base de datos');
}
