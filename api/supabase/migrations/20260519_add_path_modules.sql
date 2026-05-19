-- Migración: agregar tabla Path_Module y columnas de categoría + tiempo estimado a Path_Step
-- Ejecutar en Supabase → SQL Editor (una sola vez).

-- 1. Enum de categoría de ruta de aprendizaje
DO $$
BEGIN
  CREATE TYPE public.path_category AS ENUM (
    'TECH',
    'SOFT',
    'EMPLOYABILITY'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- 2. Tabla Path_Module
--    Agrupa Path_Step en hitos nombrados, clasificados por categoría.
CREATE TABLE IF NOT EXISTS public."Path_Module" (
  "id"               uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  "title"            text,
  "description"      text,
  "order"            integer,
  "category"         public.path_category,
  "learning_path_id" uuid REFERENCES public."Learning_Path"("id") ON DELETE CASCADE,
  "created_at"       timestamptz DEFAULT now()
);

-- 3. Columna module_id en Path_Step (opcional — backward compat con pasos sin módulo)
ALTER TABLE public."Path_Step"
  ADD COLUMN IF NOT EXISTS "module_id" uuid REFERENCES public."Path_Module"("id") ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS "estimated_minutes" integer;

-- 4. Índices de performance
CREATE INDEX IF NOT EXISTS idx_path_module_learning_path_id
  ON public."Path_Module"("learning_path_id");

CREATE INDEX IF NOT EXISTS idx_path_step_module_id
  ON public."Path_Step"("module_id");

-- 5. Recargar esquema PostgREST
NOTIFY pgrst, 'reload schema';
