/**
 * @file GymCard.tsx
 * @description Card item displaying gym with comprehensive info: name, sports, monthly price, and rating
 */

import { Star, Dumbbell, DollarSign } from "lucide-react";
import { Gym, Price } from "../hooks/useGymAPI";

interface GymCardProps {
  gym: Gym;
  onClick?: () => void;
}

export function GymCard({ gym, onClick }: GymCardProps) {
  const rating = gym.popularity_score ? gym.popularity_score / 20 : 4.5;
  
  // Get the main monthly price (first price entry)
  const monthlyPrice = gym.prices && gym.prices.length > 0 
    ? gym.prices[0].monthly_price 
    : null;

  // Get main sports (first 2)
  const mainSports = gym.sports?.slice(0, 2) || [];

  return (
    <div
      onClick={onClick}
      className="flex-shrink-0 w-full rounded-2xl overflow-hidden glass-card group cursor-pointer select-none transition-all duration-300 hover:border-primary/30 active:scale-[0.98] border border-white/10 hover:shadow-lg"
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
        <h5 className="font-headline-md text-base text-on-surface line-clamp-1">
          {gym.name}
        </h5>
        
        {/* Sports Tags */}
        {mainSports.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {mainSports.map((sport) => (
              <div
                key={sport.id}
                className="flex items-center gap-1 bg-primary/15 px-2.5 py-1 rounded-full text-xs"
              >
                <Dumbbell size={12} className="text-primary" />
                <span className="text-primary font-vazir font-semibold">
                  {sport.name}
                </span>
              </div>
            ))}
            {gym.sports.length > 2 && (
              <div className="text-xs text-on-surface-variant/70 px-2 py-1">
                +{gym.sports.length - 2}
              </div>
            )}
          </div>
        )}
        
        {/* Rating and Monthly Price */}
        <div className="flex items-center justify-between pt-2 border-t border-white/5">
          {/* Rating */}
          <div className="flex items-center gap-1.5">
            <Star size={14} className="text-primary fill-primary" />
            <span className="font-vazir font-semibold text-on-surface text-sm">
              {rating.toFixed(1)}
            </span>
            <span className="text-on-surface-variant/60 text-xs">/ 5</span>
          </div>
          
          {/* Monthly Price */}
          {monthlyPrice && (
            <div className="flex items-center gap-1.5 bg-primary/10 px-3 py-1.5 rounded-lg">
              <span className="font-vazir font-semibold text-primary text-sm">
                {monthlyPrice.toLocaleString('fa-IR')}
              </span>
              <span className="text-primary/70 text-xs">تومان</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
