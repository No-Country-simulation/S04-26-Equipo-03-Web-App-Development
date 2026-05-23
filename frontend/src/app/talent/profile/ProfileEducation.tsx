import { Skeleton } from '@/components/ui/skeleton';
import type { EduEntry } from './page';

interface ProfileEducationProps {
  education: EduEntry[];
}

const ProfileEducation = ({ education }: ProfileEducationProps) => {
  return (
    <div className="border border-gray-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900">Educación</h2>
        <a href="#" className="text-sm text-[#4f46e5] font-medium">
          + Agregar
        </a>
      </div>
      { education.length === 0 ? (
        <p className="text-sm text-gray-500">Aún no agregaste educación.</p>
      ) : (
        <div className="space-y-4">
          { education.map((edu, i) => (
            <div key={ edu.id ?? i } className="flex items-start gap-4">
              <div>
                <Skeleton className="h-10 w-10 bg-gray-300" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">{ edu.title }</p>
                <p className="text-xs text-gray-500">
                  { edu.institution }{ edu.graduation_year ? ` · ${edu.graduation_year}` : '' }
                </p>
              </div>
            </div>
          )) }
        </div>
      ) }
    </div>
  );
};
export default ProfileEducation;
