/**
 * @file GymCard.tsx
 * @description Card item displaying gym name, rating, and cover image
 */

import { Star } from "lucide-react";

interface GymCardProps {
  gym: {
    id: string | number;
    name: string;
    cover_image?: string;
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
      className="flex-shrink-0 w-64 md:w-full rounded-2xl overflow-hidden glass-card group cursor-pointer select-none transition-all duration-300 hover:border-primary/20 active:scale-[0.98]"
    >
      {/* Cover Image */}
      {gym.cover_image && (
        <div className="h-40 relative overflow-hidden">
          <img
            alt={gym.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            src={gym.cover_image}
            onError={(e) => {
              e.currentTarget.src = "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=350&q=80";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        </div>
      )}
      
      {/* Content */}
      <div className="p-4 space-y-3">
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
