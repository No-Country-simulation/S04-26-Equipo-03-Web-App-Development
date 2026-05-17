import { Star } from 'lucide-react';
interface RatingDisplayProps {
  stars: number;
  /** Texto después de las estrellas, ej: "4.7 (8)" */
  label?: string;
  size?: number;
}
export default function RatingDisplay({
  stars,
  label,
  size = 16,
}: RatingDisplayProps) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: stars }, (_, i) => (
        <Star
          key={i}
          style={{ width: size, height: size }}
          className="fill-[#fbbf24] text-[#fbbf24]"
        />
      ))}
      {label && <span className="text-xs text-gray-600 ml-1">{label}</span>}
    </div>
  );
}