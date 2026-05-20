-- Seed de skills: 20+ por tipo (TECH, SOFT, COGNITIVE)
-- Idempotente: no inserta si el title ya existe

INSERT INTO "Skill" (id, title, type)
SELECT gen_random_uuid(), v.title, v.type::skill_category
FROM (VALUES
  -- ── TECH · Desarrollo ──────────────────────────────────
  ('JavaScript',                'TECH'),
  ('TypeScript',                'TECH'),
  ('React',                     'TECH'),
  ('Next.js',                   'TECH'),
  ('Node.js',                   'TECH'),
  ('Python',                    'TECH'),
  ('SQL',                       'TECH'),
  ('PostgreSQL',                'TECH'),
  ('MongoDB',                   'TECH'),
  ('Docker',                    'TECH'),
  ('Git',                       'TECH'),
  ('REST APIs',                 'TECH'),
  ('GraphQL',                   'TECH'),
  ('AWS',                       'TECH'),
  ('CI/CD',                     'TECH'),
  ('Testing unitario',          'TECH'),
  ('Linux / Bash',              'TECH'),
  -- TECH · Diseño & producto
  ('Figma',                     'TECH'),
  ('Adobe Illustrator',         'TECH'),
  ('Adobe Photoshop',           'TECH'),
  ('Adobe XD',                  'TECH'),
  ('Sketch',                    'TECH'),
  ('Prototipado UI',            'TECH'),
  ('Design Systems',            'TECH'),
  ('Wireframing',               'TECH'),
  -- TECH · Data & BI
  ('Excel avanzado',            'TECH'),
  ('Power BI',                  'TECH'),
  ('Tableau',                   'TECH'),
  ('Google Analytics',          'TECH'),
  ('Machine Learning',          'TECH'),
  -- TECH · Marketing digital
  ('SEO / SEM',                 'TECH'),
  ('Email marketing',           'TECH'),
  ('Google Ads',                'TECH'),
  ('Meta Ads',                  'TECH'),
  -- TECH · Gestión & operaciones
  ('Jira',                      'TECH'),
  ('Notion',                    'TECH'),
  ('Trello',                    'TECH'),
  ('Salesforce',                'TECH'),
  ('HubSpot',                   'TECH'),

  -- ── SOFT ───────────────────────────────────────────────
  ('Comunicación efectiva',          'SOFT'),
  ('Trabajo en equipo',              'SOFT'),
  ('Adaptabilidad',                  'SOFT'),
  ('Gestión del tiempo',             'SOFT'),
  ('Liderazgo',                      'SOFT'),
  ('Resolución de conflictos',       'SOFT'),
  ('Empatía',                        'SOFT'),
  ('Escucha activa',                 'SOFT'),
  ('Proactividad',                   'SOFT'),
  ('Networking profesional',         'SOFT'),
  ('Presentaciones en público',      'SOFT'),
  ('Negociación',                    'SOFT'),
  ('Gestión del estrés',             'SOFT'),
  ('Mentoría',                       'SOFT'),
  ('Feedback constructivo',          'SOFT'),
  ('Inteligencia emocional',         'SOFT'),
  ('Orientación al cliente',         'SOFT'),
  ('Creatividad',                    'SOFT'),
  ('Iniciativa',                     'SOFT'),
  ('Toma de decisiones',             'SOFT'),
  ('Colaboración remota',            'SOFT'),
  ('Storytelling',                   'SOFT'),
  ('Redacción profesional',          'SOFT'),
  ('Gestión de stakeholders',        'SOFT'),

  -- ── COGNITIVE ──────────────────────────────────────────
  ('Resolución de problemas',          'COGNITIVE'),
  ('Pensamiento analítico',            'COGNITIVE'),
  ('Razonamiento lógico',              'COGNITIVE'),
  ('Atención al detalle',              'COGNITIVE'),
  ('Pensamiento sistémico',            'COGNITIVE'),
  ('Aprendizaje continuo',             'COGNITIVE'),
  ('Gestión del conocimiento',         'COGNITIVE'),
  ('Abstracción conceptual',           'COGNITIVE'),
  ('Planificación estratégica',        'COGNITIVE'),
  ('Síntesis de información',          'COGNITIVE'),
  ('Pensamiento lateral',              'COGNITIVE'),
  ('Capacidad de investigación',       'COGNITIVE'),
  ('Toma de decisiones bajo presión',  'COGNITIVE'),
  ('Gestión de la ambigüedad',         'COGNITIVE'),
  ('Priorización de tareas',           'COGNITIVE'),
  ('Design Thinking',                  'COGNITIVE'),
  ('Evaluación de riesgos',            'COGNITIVE'),
  ('Innovación aplicada',              'COGNITIVE'),
  ('Curiosidad intelectual',           'COGNITIVE'),
  ('Comprensión lectora técnica',      'COGNITIVE'),
  ('Visión de negocio',                'COGNITIVE'),
  ('Análisis de datos',                'COGNITIVE'),
  ('Pensamiento UX',                   'COGNITIVE'),
  ('Gestión de proyectos',             'COGNITIVE')
) AS v(title, type)
WHERE NOT EXISTS (
  SELECT 1 FROM "Skill" s WHERE s.title = v.title
);

