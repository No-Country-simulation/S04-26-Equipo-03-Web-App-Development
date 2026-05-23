import { Skeleton } from '@/components/ui/skeleton';
import type { WorkExp } from './page';

interface Props {
  experience: WorkExp[];
}

const ProfileExperienceData = ({ experience }: Props) => {
  if (experience.length === 0) {
    return (
      <p className="text-sm text-gray-500">
        Aún no agregaste experiencia laboral.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      { experience.map((exp, i) => {
        const period = exp.is_current
          ? `${exp.start_date ?? ''} – Presente`
          : [exp.start_date, exp.end_date].filter(Boolean).join(' – ');
        return (
          <div key={ exp.id ?? i } className="flex items-start gap-4">
            <div>
              <Skeleton className="h-10 w-10 bg-gray-300" />
            </div>
            <div className="w-full">
              <p className="font-semibold text-gray-900">{ exp.role }</p>
              <p className="text-xs text-gray-500">
                { exp.company }{ period ? ` · ${period}` : '' }
              </p>
              { exp.description && (
                <p className="text-xs text-gray-600 mt-1">{ exp.description }</p>
              ) }
            </div>
          </div>
        );
      }) }
    </div>
  );
};

export default ProfileExperienceData;
