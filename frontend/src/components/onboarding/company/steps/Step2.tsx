'use client';

import { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { X } from 'lucide-react';

const MOCK_ROLES = [
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'DevOps Engineer',
  'Data Scientist',
  'UI/UX Designer',
  'Product Manager',
  'Mobile Developer',
  'QA Engineer',
  'Security Engineer',
];

const MOCK_STACKS = [
  'React',
  'Angular',
  'Vue.js',
  'Node.js',
  'Python',
  'Java',
  'AWS',
  'Docker',
  'PostgreSQL',
  'TypeScript',
];

const EXPERIENCE_LEVELS = [
  'Trainee',
  'Junior',
  'Semi-Senior',
  'Senior',
  'Lead',
];

interface Step2Props {
  data: Record<string, unknown>;
  onUpdate: (data: Record<string, unknown>) => void;
  onNext?: () => void;
  onBack?: () => void;
}

export function Step2({ data, onUpdate }: Step2Props) {
  const [selectedRoles, setSelectedRoles] = useState<string[]>(
    (data.selectedRoles as string[]) || []
  );
  const [selectedStacks, setSelectedStacks] = useState<string[]>(
    (data.selectedStacks as string[]) || []
  );
  const [selectedLevels, setSelectedLevels] = useState<string[]>(
    (data.selectedLevels as string[]) || []
  );
  const [roleSearch, setRoleSearch] = useState('');
  const [stackSearch, setStackSearch] = useState('');
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [stackDropdownOpen, setStackDropdownOpen] = useState(false);

  const roleRef = useRef<HTMLDivElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (roleRef.current && !roleRef.current.contains(e.target as Node)) {
        setRoleDropdownOpen(false);
      }
      if (stackRef.current && !stackRef.current.contains(e.target as Node)) {
        setStackDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredRoles = MOCK_ROLES.filter(
    (role) =>
      role.toLowerCase().includes(roleSearch.toLowerCase()) &&
      !selectedRoles.includes(role)
  );

  const filteredStacks = MOCK_STACKS.filter(
    (stack) =>
      stack.toLowerCase().includes(stackSearch.toLowerCase()) &&
      !selectedStacks.includes(stack)
  );

  const toggleRole = (role: string) => {
    const updated = selectedRoles.includes(role)
      ? selectedRoles.filter((r) => r !== role)
      : [...selectedRoles, role];
    setSelectedRoles(updated);
    onUpdate({ ...data, selectedRoles: updated });
    setRoleSearch('');
  };

  const toggleStack = (stack: string) => {
    const updated = selectedStacks.includes(stack)
      ? selectedStacks.filter((s) => s !== stack)
      : [...selectedStacks, stack];
    setSelectedStacks(updated);
    onUpdate({ ...data, selectedStacks: updated });
    setStackSearch('');
  };

  const toggleLevel = (level: string) => {
    const updated = selectedLevels.includes(level)
      ? selectedLevels.filter((l) => l !== level)
      : [...selectedLevels, level];
    setSelectedLevels(updated);
    onUpdate({ ...data, selectedLevels: updated });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[#1a1a2e]">
          ¿Qué perfiles buscás habitualmente?
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Lo usamos para sugerirte candidatos sin que tengas que filtrar
          manualmente.
        </p>
      </div>

      {/* ROLES */}
      <div className="space-y-3" ref={roleRef}>
        <label className="block text-sm font-medium text-[#1a1a2e]">
          ROLES
        </label>
        <div className="relative">
          <Input
            type="text"
            placeholder="Buscar rol..."
            value={roleSearch}
            onChange={(e) => {
              setRoleSearch(e.target.value);
              setRoleDropdownOpen(true);
            }}
            onFocus={() => setRoleDropdownOpen(true)}
            className="h-12 rounded-md border-0 bg-gray-50 px-3 text-sm focus-visible:ring-1 focus-visible:ring-gray-300"
          />
          {roleDropdownOpen && filteredRoles.length > 0 && (
            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto">
              {filteredRoles.map((role) => (
                <button
                  key={role}
                  onClick={() => toggleRole(role)}
                  className="w-full text-left px-3 py-2 text-sm text-[#1a1a2e] hover:bg-gray-50"
                >
                  {role}
                </button>
              ))}
            </div>
          )}
        </div>
        {selectedRoles.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedRoles.map((role) => (
              <Badge
                key={role}
                variant="outline"
                className="text-[#4f46e5] border-[#C7D2FE] bg-[#EEF2FF] px-3 py-1.5 text-sm font-normal flex items-center gap-1"
              >
                {role}
                <button onClick={() => toggleRole(role)}>
                  <X className="w-3.5 h-3.5 cursor-pointer" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* STACKS */}
      <div className="space-y-3" ref={stackRef}>
        <label className="block text-sm font-medium text-[#1a1a2e]">
          STACKS
        </label>
        <div className="relative">
          <Input
            type="text"
            placeholder="Buscar stack o herramienta..."
            value={stackSearch}
            onChange={(e) => {
              setStackSearch(e.target.value);
              setStackDropdownOpen(true);
            }}
            onFocus={() => setStackDropdownOpen(true)}
            className="h-12 rounded-md border-0 bg-gray-50 px-3 text-sm focus-visible:ring-1 focus-visible:ring-gray-300"
          />
          {stackDropdownOpen && filteredStacks.length > 0 && (
            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto">
              {filteredStacks.map((stack) => (
                <button
                  key={stack}
                  onClick={() => toggleStack(stack)}
                  className="w-full text-left px-3 py-2 text-sm text-[#1a1a2e] hover:bg-gray-50"
                >
                  {stack}
                </button>
              ))}
            </div>
          )}
        </div>
        {selectedStacks.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedStacks.map((stack) => (
              <Badge
                key={stack}
                variant="outline"
                className="text-[#374151] border-[#E5E7EB] bg-[#F3F4F6] px-3 py-1.5 text-sm font-normal flex items-center gap-1"
              >
                {stack}
                <button onClick={() => toggleStack(stack)}>
                  <X className="w-3.5 h-3.5 cursor-pointer" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Niveles de experiencia */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-[#1a1a2e]">
          Niveles de experiencia
        </label>
        <div className="flex flex-wrap gap-2">
          {EXPERIENCE_LEVELS.map((level) => {
            const isSelected = selectedLevels.includes(level);
            return (
              <label
                key={level}
                className={`flex items-center gap-3 rounded-md border cursor-pointer transition-colors
                  shadow-[0_1px_3px_0_rgba(17,24,39,0.08)]
                  ${
                    isSelected
                      ? 'border-[#4f46e5] bg-[#EEF2FF]'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }
                `}
                style={{
                  paddingLeft: '12.25px',
                  paddingRight: '10.25px',
                  paddingTop: '10.25px',
                  paddingBottom: '10.25px',
                }}
              >
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={() => toggleLevel(level)}
                  className={`${
                    isSelected
                      ? 'data-[state=checked]:bg-[#4f46e5] data-[state=checked]:border-[#4f46e5]'
                      : ''
                  }`}
                />
                <span className="text-sm text-[#1a1a2e] whitespace-nowrap">
                  {level}
                </span>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
}
