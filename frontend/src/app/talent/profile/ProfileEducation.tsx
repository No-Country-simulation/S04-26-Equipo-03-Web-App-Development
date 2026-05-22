import { Skeleton } from '@/components/ui/skeleton';

const ProfileEducation = () => {
  return (
    <div className="border border-gray-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900">Educación</h2>
        <a href="#" className="text-sm text-[#4f46e5] font-medium">
          + Agregar
        </a>
      </div>
      <div className="flex items-start gap-4">
        <div>
          <Skeleton className="h-10 w-10 bg-gray-300" />
        </div>
        <div>
          <p className="font-semibold text-gray-900">Lic. en Diseño Gráfico</p>
          <p className="text-xs text-gray-500">UBA · 2008</p>
        </div>
      </div>
    </div>
  );
};
export default ProfileEducation;
