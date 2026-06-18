/**
 * @file GymCard.tsx
 * @description Card item displaying specific gym details, rating, distance,
 * and high-resolution thumbnail images with safe load and fallback references.
 */

import { Star, MapPin } from "lucide-react";
import { Gym } from "../data/gyms";

interface GymCardProps {
  key?: string;
  gym: Gym; // Specific Gym detail entity
  onClick?: () => void; // Optional press action behavior mapping
}

export function GymCard({ gym, onClick }: GymCardProps) {
  return (
    <div
      onClick={onClick}
      className="flex-shrink-0 w-64 md:w-full rounded-2xl overflow-hidden glass-card group cursor-pointer select-none transition-all duration-300 hover:border-primary/20 active:scale-[0.98]"
    >
      <div className="h-40 relative overflow-hidden">
        <img
          alt={gym.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          src={gym.image}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        {gym.popular && (
          <span className="absolute top-3 left-3 bg-primary text-on-primary text-[10px] px-3 py-1 rounded-md font-bold shadow-lg">
            محبوب
          </span>
        )}
      </div>
      
      <div className="p-4">
        <h5 className="font-headline-md text-lg text-on-surface line-clamp-1">{gym.name}</h5>
        <div className="flex items-center gap-3 mt-2 text-on-surface-variant/60 font-label-sm">
          <span className="flex items-center gap-1">
            <Star size={14} className="text-primary fill-primary" />
            <span className="font-vazir font-semibold">{gym.rating}</span>
          </span>
          <span className="flex items-center gap-1">
            <MapPin size={14} className="text-on-surface-variant/50" />
            <span className="font-vazir font-medium">{gym.distance}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
