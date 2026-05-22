import { Skeleton } from '@/components/ui/skeleton';
import { mockExperience } from './_data';

const ProfileExperienceData = () => {
  return (
    <div className="space-y-6">
      {mockExperience.map((exp) => (
        <div key={exp.title} className="flex items-start gap-4">
          <div>
            <Skeleton className="h-10 w-10 bg-gray-300" />
          </div>
          <div className="w-full">
            <p className="font-semibold text-gray-900">{exp.title}</p>
            <p className="text-xs text-gray-500">
              {exp.organization} · {exp.period}
            </p>
            <Skeleton className="max-w-11/12 h-3 mt-2 bg-gray-300" />
            <Skeleton className="max-w-8/12 h-3 mt-2 bg-gray-300" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProfileExperienceData;
