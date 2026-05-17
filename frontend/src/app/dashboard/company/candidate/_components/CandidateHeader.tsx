import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import SkillBadge from '@/components/common/SkillBadge';
import RatingDisplay from '../../common/RatingDisplay';

export interface CandidateData {
  name: string;
  initials: string;
  role: string;
  location: string;
  status: string;
  level: string;
  ratingStars: number;
  ratingLabel: string;
  isVerified?: boolean;
  experience: string;
}

interface CandidateHeaderProps {
  candidate: CandidateData;
}

export default function CandidateHeader({
  candidate,
}: CandidateHeaderProps) {
  const {
    name,
    initials,
    role,
    location,
    status,
    level,
    ratingStars,
    ratingLabel,
    isVerified = true,
    experience,
  } = candidate;
  return (
    <Card className="p-6 border-gray-200">
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center text-[#1a1a2e] font-bold text-lg">
          {initials}
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-[#1a1a2e]">{name}</h1>
          <p className="text-sm text-gray-600">
            {role} · {location}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <span className="inline-block w-2 h-2 bg-green-500 rounded-full" />
            <span className="text-sm text-gray-600">{status}</span>
          </div>
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <SkillBadge variant="level">{level}</SkillBadge>
            <RatingDisplay stars={ratingStars} label={ratingLabel} />
            {isVerified && <SkillBadge variant="star">100% verificado</SkillBadge>}
            <Badge className="bg-[#F3F4F6] text-xs text-[#6B7280] mt-2 border border-[#E5E7EB] rounded-full">
              {experience}
            </Badge>
          </div>
        </div>
      </div>
    </Card>
  );
}
