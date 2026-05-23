import Link from 'next/link';
import SkillBadge from '@/components/common/SkillBadge';
import type { SkillItem } from './page';

interface ProfileSkillsProps {
  skills: SkillItem[];
}

const ProfileSkills = ({ skills }: ProfileSkillsProps) => {
  if (skills.length === 0) {
    return (
      <div className="border border-gray-200 rounded-lg p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-2">Skills</h2>
        <p className="text-sm text-gray-500">
          Aún no agregaste skills. Completá el onboarding para ver tus skills aquí.
        </p>
      </div>
    );
  }

  const validated = skills.filter((s) => s.validated === true);
  const pending = skills.filter((s) => s.validated !== true);

  return (
    <div className="border border-gray-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900">Skills</h2>
        <Link href="/talent/skill-validation" className="text-sm text-[#4f46e5] font-medium">
          Validar skills
        </Link>
      </div>
      <p className="text-xs text-gray-500 mb-4">
        Validadas en verde (diagnóstico completado). Pendientes en gris — no aumentan tu visibilidad hasta validarlas.
      </p>
      <div className="flex flex-wrap gap-2 mb-4">
        { validated.map((s) => (
          <SkillBadge key={ s.skill_id } variant="verified">
            { s.Skill?.title ?? s.skill_id }
          </SkillBadge>
        )) }
        { pending.map((s) => (
          <SkillBadge key={ s.skill_id } variant="pending">
            { s.Skill?.title ?? s.skill_id }
          </SkillBadge>
        )) }
      </div>
      <p className="text-xs text-gray-600">
        { validated.length } de { skills.length } skills validadas.
        { pending.length > 0 && (
          <> Validá las { pending.length } restantes para aumentar tu visibilidad.</>
        ) }
      </p>
    </div>
  );
};

export default ProfileSkills;
