/**
 * @file GymCard.tsx
 * @description Card item displaying gym name and rating only
 */

import { Star } from "lucide-react";

interface GymCardProps {
  gym: {
    id: string | number;
    name: string;
    popularity_score?: number;
    rating?: number;
  };
  onClick?: () => void;
}

export function GymCard({ gym, onClick }: GymCardProps) {
  const rating = gym.rating || (gym.popularity_score ? gym.popularity_score / 20 : 4.5);

  return (
    <div
      onClick={onClick}
      className="flex-shrink-0 w-64 md:w-full rounded-2xl overflow-hidden glass-card group cursor-pointer select-none transition-all duration-300 hover:border-primary/20 active:scale-[0.98] p-4"
    >
      <div className="space-y-3">
        {/* Gym Name */}
        <h5 className="font-headline-md text-lg text-on-surface line-clamp-2">{gym.name}</h5>
        
        {/* Rating */}
        <div className="flex items-center gap-2">
          <Star size={16} className="text-primary fill-primary" />
          <span className="font-vazir font-semibold text-on-surface">
            {rating.toFixed(1)}
          </span>
          <span className="text-on-surface-variant/60 text-sm">/ 5</span>
        </div>
      </div>
    </div>
  );
}
