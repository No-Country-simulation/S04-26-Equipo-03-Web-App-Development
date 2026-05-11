import { Star } from 'lucide-react';
import { useState } from 'react';
interface RatingStarsProps {
  value?: number;
  onChange?: (rating: number) => void;
  size?: number;
}
export default function RatingStars({
//   value = 0,
//   onChange,
  size = 16,
}: RatingStarsProps) {
    const [minRating, setMinRating] = useState(4); // Este valor deberia venir del componente padre o estado global
  const [hover, setHover] = useState(0);
  const active = hover || minRating;
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
        //   onClick={() => onChange?.(star)}
          onClick={() => setMinRating(star)}
          className={`cursor-pointer transition-colors ${
            star <= active
              ? 'fill-[#ffc107] text-[#ffc107]'
              : 'fill-white text-[#D1D5DB]'
          }`}
        />
      ))}
      {active > 0 && (
        <p className="text-xs text-[#999] ml-2">{active}+ estrellas</p>
      )}
    </div>
  );
}