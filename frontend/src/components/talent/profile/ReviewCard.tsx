import { Star } from 'lucide-react';

interface NormalReviewProps {
  name: string;
  initial: string;
  rating: number;
  text: string;
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
    <div className="border-b border-gray-100 pb-4">
      {props.status === 'reported' ? (
        <ReportedReview />
      ) : (
        <NormalReview {...(props as NormalReviewProps)} />
      )}
    </div>
  );
}

function NormalReview({
  name,
  initial,
  rating,
  source,
  text,
  status = 'verified',
}: NormalReviewProps) {
  return (
    <>
      <div className="flex items-start gap-3 mb-2">
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${avatarStyles[status]}`}
        >
          {initial}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-gray-900">{name}</p>
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'}`}
                />
              ))}
            </div>
          </div>
          <p className="text-xs text-gray-500">{source}</p>
        </div>
      </div>
      <p className="text-sm text-gray-700">{text}</p>
    </>
  );
}

function ReportedReview() {
  return (
    <>
      <div className="flex items-start gap-3 mb-2">
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold bg-indigo-100 text-indigo-600">
          —
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-gray-900">—</p>
            <p className="text-xs text-gray-500">En revisión</p>
          </div>
          <p className="text-xs text-gray-500">Reclutador / empleador</p>
        </div>
      </div>
      <p className="text-sm text-gray-500 italic mb-1">
        Esta reseña fue denunciada y está siendo revisada por el equipo.
      </p>
      <p className="text-sm text-gray-500 italic">
        Solo vos podés ver este estado. ningún reclutador ve esta reseña hasta
        que un administrador la revise.
      </p>
    </>
  );
}


