/**
 * @file GymListCard.tsx
 * @description Beautiful gym card component for displaying gym information in grid/list layouts
 * Shows cover image, name, address, rating, and quick action button
 */

import { MapPin, Star, Phone } from "lucide-react";
import { Gym } from "../pages/AllGymsPage";

interface GymListCardProps {
  gym: Gym;
  onClick: () => void;
}

export function GymListCard({ gym, onClick }: GymListCardProps) {
  return (
    <button
      onClick={onClick}
      className="group relative overflow-hidden rounded-2xl bg-surface-container/50 border border-white/10 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 active:scale-95 text-right cursor-pointer"
    >
      {/* Cover Image */}
      <div className="relative w-full h-40 overflow-hidden bg-surface-variant/30">
        {gym.cover_image ? (
          <img
            src={gym.cover_image}
            alt={gym.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-transparent">
            <div className="text-4xl">🏋️</div>
          </div>
        )}
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Popular Badge */}
        {gym.is_popular && (
          <div className="absolute top-3 right-3 bg-primary px-3 py-1 rounded-full flex items-center gap-1">
            <Star size={14} className="fill-current text-black" />
            <span className="text-xs font-bold text-black">محبوب</span>
          </div>
        )}

        {/* Popularity Score */}
        {gym.popularity_score > 0 && (
          <div className="absolute bottom-3 right-3 bg-black/40 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1">
            <Star size={12} className="fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-medium text-white">{gym.popularity_score.toFixed(1)}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Name */}
        <h3 className="font-bold text-base text-on-surface line-clamp-2 group-hover:text-primary transition-colors">
          {gym.name}
        </h3>

        {/* Address */}
        <div className="flex items-start gap-2 text-sm text-on-surface-variant/70">
          <MapPin size={16} className="flex-shrink-0 mt-0.5" />
          <p className="line-clamp-2">{gym.address}</p>
        </div>

        {/* Phone */}
        {gym.phone && (
          <div className="flex items-center gap-2 text-sm text-on-surface-variant/70">
            <Phone size={16} className="flex-shrink-0" />
            <p className="truncate">{gym.phone}</p>
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
          className="w-full mt-4 py-2.5 bg-primary/10 border border-primary/30 text-primary rounded-xl font-medium hover:bg-primary/20 transition-colors active:scale-95"
        >
          مشاهده جزئیات
        </button>
      </div>
    </button>
  );
}
