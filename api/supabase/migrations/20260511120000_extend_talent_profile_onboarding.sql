-- Ejecutar TODO este archivo en Supabase → SQL Editor (una sola vez).
-- Luego probá de nuevo la API. PostgREST refresca el esquema con NOTIFY al final.

-- Enum de disponibilidad (Figma paso 1)
DO $$
BEGIN
  CREATE TYPE public.talent_availability AS ENUM (
    'ACTIVE_JOB_SEARCH',
    'OPEN_TO_OFFERS',
    'NOT_LOOKING_ASSESSMENT_ONLY'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Columnas: detecta la tabla real (Postgres guarda el nombre según cómo se creó la tabla).
DO $$
DECLARE
  rel name;
BEGIN
  SELECT c.relname
  INTO rel
  FROM pg_class c
  JOIN pg_namespace n ON n.oid = c.relnamespace
  WHERE n.nspname = 'public'
    AND c.relkind = 'r'
    AND (c.relname = 'Talent_profile' OR c.relname = 'talent_profile')
  ORDER BY
    CASE WHEN c.relname = 'Talent_profile' THEN 0 ELSE 1 END
  LIMIT 1;

  IF rel IS NULL THEN
    RAISE EXCEPTION
      'No existe public.Talent_profile ni public.talent_profile. Revisá el nombre de la tabla en el dashboard.';
  END IF;

  EXECUTE format(
    'ALTER TABLE public.%I
      ADD COLUMN IF NOT EXISTS avatar_url text,
      ADD COLUMN IF NOT EXISTS availability public.talent_availability,
      ADD COLUMN IF NOT EXISTS bio text,
      ADD COLUMN IF NOT EXISTS portfolio_url text,
      ADD COLUMN IF NOT EXISTS portfolio_public_id text,
      ADD COLUMN IF NOT EXISTS work_experience jsonb',
    rel
  );

  EXECUTE format(
    'COMMENT ON COLUMN public.%I.avatar_url IS ''URL Cloudinary (foto perfil onboarding)''',
    rel
  );
  EXECUTE format(
    'COMMENT ON COLUMN public.%I.availability IS ''Disponibilidad laboral (Figma)''',
    rel
  );
  EXECUTE format(
    'COMMENT ON COLUMN public.%I.bio IS ''Sobre mí / descripción personal''',
    rel
  );
  EXECUTE format(
    'COMMENT ON COLUMN public.%I.portfolio_url IS ''Link portfolio si no es PDF''',
    rel
  );
  EXECUTE format(
    'COMMENT ON COLUMN public.%I.portfolio_public_id IS ''public_id Cloudinary si el portfolio es PDF''',
    rel
  );
  EXECUTE format(
    'COMMENT ON COLUMN public.%I.work_experience IS ''JSON array: company, role, description, from_month_year, to_month_year, current''',
    rel
  );

  RAISE NOTICE 'Talent_profile: columnas OK (tabla física: %)', rel::text;
END $$;

-- Obligatorio para que PostgREST deje de usar el esquema cacheado sin esas columnas
NOTIFY pgrst, 'reload schema';
