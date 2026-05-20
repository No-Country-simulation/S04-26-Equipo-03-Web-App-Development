import RatingDisplay from '@/app/talent/profile/RatingDisplay';
import SkillBadge from '@/components/common/SkillBadge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Star } from 'lucide-react';

interface NormalReviewProps {
  name: string;
  rating: number;
  text: string;
  company: string;
  status?: 'verified' | 'pending' | 'reported';
  source: string;
}

const avatarStyles: Record<string, string> = {
  verified: 'bg-indigo-100 text-indigo-600',
  pending: 'bg-gray-200 text-gray-700',
  reported: 'bg-indigo-100 text-indigo-600',
};

export function ReviewCard(props: NormalReviewProps) {
  return (
    <div
      className={`border border-[#E5E7EB] rounded-md p-4 ${props.status === 'reported' ? 'bg-[#F9FAFB] opacity-70' : ''}`}
    >
      {props.status === 'reported' ? (
        <ReportedReview {...(props as NormalReviewProps)} />
      ) : (
        <NormalReview {...(props as NormalReviewProps)} />
      )}
    </div>
  );
}

function NormalReview({
  name,
  rating,
  source,
  text,
  company,
  status = 'verified',
}: NormalReviewProps) {
  return (
    <>
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback className={`font-bold ${avatarStyles[status]}`}>
              {name[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-row items-center gap-4">
            <div className="flex flex-col gap-1 items-start">
              <p className="font-semibold text-sm text-[#1a1a2e]">{name}</p>
              <p className="text-xs text-gray-600">{company}</p>
            </div>
            <SkillBadge
              variant={source.includes('Reclutador') ? 'filter' : 'muted'}
            >
              {source}
            </SkillBadge>
          </div>
        </div>
        <RatingDisplay stars={rating} />
      </div>
      <p className="text-sm text-gray-700">{text}</p>
    </>
  );
}

function ReportedReview({ source, status = 'reported' }: NormalReviewProps) {
  return (
    <>
      <div className="flex items-start gap-3 mb-3">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback className={`font-bold ${avatarStyles[status]}`}>
              -
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-row items-center gap-4">
            <div className="flex flex-col gap-1 items-start">
              <p className="font-semibold text-sm text-[#1a1a2e]">-</p>
              <p className="text-xs text-gray-500">En revisión</p>
            </div>
            <SkillBadge
              variant={source.includes('Reclutador') ? 'filter' : 'muted'}
            >
              {source}
            </SkillBadge>
          </div>
        </div>
      </div>
      <p className="text-sm text-gray-600 italic mb-1">
        Esta reseña fue denunciada y está siendo revisada por el equipo.
      </p>
      <p className="text-sm text-gray-600 italic">
        Solo vos podés ver este estado. ningún reclutador ve esta reseña hasta
        que un administrador la revise.
      </p>
    </>
  );
}
