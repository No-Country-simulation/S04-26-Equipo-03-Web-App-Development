-- Agrega skill_id a Diagnostic para rastrear qué skill se está validando
ALTER TABLE "Diagnostic"
  ADD COLUMN IF NOT EXISTS skill_id UUID REFERENCES "Skill"(id) ON DELETE SET NULL;

-- Solo aplica para diagnósticos de tipo SKILL_VALIDATION
COMMENT ON COLUMN "Diagnostic".skill_id IS 'Skill específica evaluada. Solo se completa para diagnósticos de tipo SKILL_VALIDATION.';
