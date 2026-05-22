import SkillBadge from '@/components/common/SkillBadge';
import { mockSkills } from './_data';

const ProfileSkills = () => {
  return (
    <div className="border border-gray-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900">Skills</h2>
        <a href="#" className="text-sm text-[#4f46e5] font-medium">
          Validar más skills
        </a>
      </div>
      <p className="text-xs text-gray-500 mb-4">
        Validadas en verde. Declaradas pendientes en gris — no afectan la
        visibilidad para muchos reclutadores filtran por verificación.
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        {mockSkills.map((skill) => {
          if (skill.level === 'pendiente')
            return (
              <SkillBadge key={skill.name} variant="pending">
                {skill.name}
              </SkillBadge>
            );
          return (
            <SkillBadge key={skill.name} variant="verified">
              {skill.name} · {skill.level}
            </SkillBadge>
          );
        })}
      </div>

      <p className="text-xs text-gray-600 flex items-center gap-1">
        5 de 8 skills validadas. Valida las 3 restantes para desbloquear el
        badge <SkillBadge variant="star">100% verificado</SkillBadge>
      </p>
    </div>
  );
};

export default ProfileSkills;
