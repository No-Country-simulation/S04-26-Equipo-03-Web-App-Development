import ProfileExperienceData from './ProfileExperienceData';
import type { WorkExp } from './page';

interface ProfileExperienceProps {
  experience: WorkExp[];
}

const ProfileExperience = ({ experience }: ProfileExperienceProps) => {
  return (
    <div className="border border-gray-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900">Experiencia</h2>
        <a href="#" className="text-sm text-[#4f46e5] font-medium">
          + Agregar
        </a>
      </div>
      <ProfileExperienceData experience={ experience } />
    </div>
  );
};
export default ProfileExperience;
