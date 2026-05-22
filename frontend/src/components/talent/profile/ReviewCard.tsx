import RatingDisplay from '@/app/talent/profile/RatingDisplay';
import SkillBadge from '@/components/common/SkillBadge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

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
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-3">
        <div className="flex items-start gap-3 min-w-0">
          <Avatar className="size-10 shrink-0">
            <AvatarFallback className={`font-bold ${avatarStyles[status]}`}>
              {name[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
              <p className="font-semibold text-sm text-[#1a1a2e] truncate">
                {name}
              </p>
              <SkillBadge
                variant={source.includes('Reclutador') ? 'filter' : 'muted'}
              >
                {source}
              </SkillBadge>
            </div>
            <p className="text-xs text-gray-600 truncate">{company}</p>
          </div>
        </div>
        <RatingDisplay stars={rating} size={14} />
      </div>
      <p className="text-sm text-gray-700">{text}</p>
    </>
  );
}

function ReportedReview({ source, status = 'reported' }: NormalReviewProps) {
  return (
    <>
      <div className="flex items-start gap-3 mb-3">
        <Avatar className="size-10 shrink-0">
          <AvatarFallback className={`font-bold ${avatarStyles[status]}`}>
            -
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
            <p className="font-semibold text-sm text-[#1a1a2e]">-</p>
            <SkillBadge
              variant={source.includes('Reclutador') ? 'filter' : 'muted'}
            >
              {source}
            </SkillBadge>
          </div>
          <p className="text-xs text-gray-500">En revisión</p>
        </div>
      </div>
      <p className="text-sm text-gray-600 italic mb-1">
        Esta reseña fue denunciada y está siendo revisada por el equipo.
      </p>
      <p className="text-sm text-gray-600 italic font-light">
        Solo vos podés ver este estado. ningún reclutador ve esta reseña hasta
        que un administrador la revise.
      </p>
    </>
  );
}
