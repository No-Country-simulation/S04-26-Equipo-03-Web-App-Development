import { ReviewCard } from '@/components/talent/profile/ReviewCard';
import RatingDisplay from './RatingDisplay';
import { mockReviews } from './_data';

const ProfileReviews = () => {
  return (
    <div className="border border-gray-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Reseñas</h2>
          <p className="text-xs text-gray-500">habilidades blandas</p>
        </div>
        <a href="#" className="text-sm text-[#4f46e5] font-medium">
          + Solicitar reseña
        </a>
      </div>

      <div className="flex items-center gap-4 mb-6 mt-6 border-b border-[#E5E7EB] pb-4">
        <div className="text-4xl font-bold text-[#1a1a2e]">4.7</div>
        <RatingDisplay stars={5} label="Promedio sobre 8 reseñas verificadas" />
      </div>

      <div className="space-y-4">
        {mockReviews.map((item, i) => (
          <ReviewCard
            key={i}
            name={item.author}
            rating={item.ratin}
            text={item.review}
            source={item.role}
            company={item.company}
            status={item.status as 'verified' | 'pending' | 'reported'}
          />
        ))}
      </div>
    </div>
  );
};

export default ProfileReviews;
