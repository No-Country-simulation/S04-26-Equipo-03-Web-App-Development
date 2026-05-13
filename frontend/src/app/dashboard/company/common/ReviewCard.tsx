import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import SkillBadge from '@/components/common/SkillBadge';
import RatingDisplay from './RatingDisplay';

interface ReviewItemProps {
  author: string;
  company: string;
  role: string;
  rating: number;
  review: string;
}
export default function ReviewCard({
  author,
  company,
  role,
  rating,
  review,
}: ReviewItemProps) {
  const avatarBg =
    role === 'Reclutador / empleado'
      ? 'bg-[#E0E7FF] text-[#4F46E5]'
      : 'bg-[#E5E7EB] text-[#374151]';
  return (
    <div className="border border-[#E5E7EB] p-4 rounded-md">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarFallback className={`font-bold ${avatarBg}`}>
              {author[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex gap-1 items-center">
              <p className="font-semibold text-sm text-[#1a1a2e]">{author}</p>
              <p className="text-xs text-gray-600">{company}</p>
            </div>
            <SkillBadge variant="filter">{role}</SkillBadge>
          </div>
        </div>
        <RatingDisplay stars={rating} />
      </div>
      <p className="text-sm text-gray-700">{review}</p>
    </div>
  );
}