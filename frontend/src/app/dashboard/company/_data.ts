export const mockCandidates = [
  {
    id: 1,
    name: 'Marcela R.',
    role: 'Product Designer',
    rating: 4.7,
    level: 'Semi-Senior',
    skills: ['Figma', 'Research'],
    pendingSkills: ['Design Sys'],
    status: 'Open to work · Remoto',
    experience: '12 años exp. · Último: Sr Designer en —',
    avatar: 'MR',
  },
  {
    id: 2,
    name: 'Hernán T.',
    role: 'Frontend Engineer',
    rating: 4.9,
    level: 'Senior',
    verified: true,
    skills: ['React', 'TypeScript', 'Next.js'],
    pendingSkills: [],
    status: 'Open to work · Remoto',
    experience: '14 años exp. · Último: Tech Lead en —',
    avatar: 'HT',
  },
  {
    id: 3,
    name: 'Lucia F.',
    role: 'UX Researcher',
    rating: 4.5,
    level: 'Senior',
    skills: ['Mixed methods', 'Figma'],
    pendingSkills: ['SQL'],
    status: 'Open to work · Remoto',
    experience: '10 años exp.',
    avatar: 'LF',
  },
  {
    id: 4,
    name: 'Diego A.',
    role: 'Product Manager',
    rating: 0,
    level: 'Semi-Senior',
    skills: ['Roadmaps'],
    pendingSkills: ['Analytics', 'Jira'],
    status: 'Open to work · Remoto',
    experience: '9 años exp.',
    avatar: 'DA',
  },
];

export const mockLevel = {
  level: [
    { label: 'Trainee', value: 'Trainee' },
    { label: 'Junior', value: 'Junior' },
    { label: 'Semi-Senior', value: 'Semi-Senior' },
    { label: 'Senior', value: 'Senior' },
    { label: 'Lead', value: 'Lead' },
  ],
  defaultSelected: ['Semi-Senior', 'Senior', 'Lead'],
};

export const mockModality = {
  modality: [
    { label: 'Remoto', value: 'Remoto' },
    { label: 'Híbrido', value: 'Híbrido' },
    { label: 'Presencial', value: 'Presencial' },
  ],
  defaultSelected: ['Remoto', 'Híbrido'],
};

export const mockAvailability = {
  options: [
    { label: 'Cualquiera', value: 'Cualquiera' },
    { label: 'Disponible activamente', value: 'Disponible activamente' },
    { label: 'Abierto a oportunidades', value: 'Abierto a oportunidades' },
  ],
  defaultValue: 'Disponible activamente',
};