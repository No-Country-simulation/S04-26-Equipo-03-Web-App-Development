-- Asigna Talent_Role a perfiles existentes que no tengan uno.
-- Usa last_position del perfil si está disponible, o asigna un default genérico.
-- Idempotente: solo inserta donde falte.

INSERT INTO "Talent_Role" (id, profile_id, role_name, visible, cv_url)
SELECT
  gen_random_uuid(),
  tp.id,
  COALESCE(tp.last_position, 'Profesional'),
  true,
  NULL
FROM "Talent_profile" tp
WHERE NOT EXISTS (
  SELECT 1 FROM "Talent_Role" tr WHERE tr.profile_id = tp.id
);

-- Recargar esquema PostgREST
NOTIFY pgrst, 'reload schema';
