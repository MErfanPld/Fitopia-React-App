import React, { useEffect, useState } from "react";
import { useHomeSliders } from "../hooks/useHomeSliders";

/**
 * PromoSlider
 * - Fetches active sliders from /core/home-sliders/ API endpoint
 * - Auto-rotates through sliders with configurable interval
 * - Displays responsive carousel with navigation dots and buttons
 * - Shows loading skeleton while fetching data
 */

type Props = {
  intervalMs?: number;
};

export default function PromoSlider({ intervalMs = 5000 }: Props) {
  const { sliders, loading, error } = useHomeSliders();
  const [index, setIndex] = useState(0);
  const count = sliders.length;

  // Auto-rotate slides
  useEffect(() => {
    if (count <= 1) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % count), intervalMs);
    return () => clearInterval(t);
  }, [count, intervalMs]);

  // Show loading skeleton
  if (loading) {
    return (
      <section className="w-full mb-6">
        <div className="relative rounded-xl overflow-hidden shadow-lg h-40 md:h-48 lg:h-56 bg-surface/50 animate-pulse" />
      </section>
    );
  }

  // Handle no sliders or error
  if (error || count === 0) {
    return null;
  }

  // Navigation functions
  const go = (i: number) => setIndex(((i % count) + count) % count);
  const prev = () => go(index - 1);
  const next = () => go(index + 1);
  const slide = sliders[index];

  return (
    <section className="w-full mb-6">
      <div className="relative rounded-xl overflow-hidden shadow-lg h-40 md:h-48 lg:h-56">
        {/* Background image */}
        {slide.image ? (
          <img
            src={slide.image}
            alt={slide.title}
            className="absolute inset-0 w-full h-full object-cover z-0"
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            onError={(e) => {
              // Fallback to placeholder if image fails to load
              const target = e.currentTarget as HTMLImageElement;
              if (!target.dataset.fallbackApplied) {
                target.dataset.fallbackApplied = "1";
                target.src = "https://via.placeholder.com/800x400?text=Fitopia";
              }
            }}
          />
        ) : (
          <div className="absolute inset-0 w-full h-full bg-surface z-0" />
        )}

        {/* Compact content area (bottom-right) */}
        <div className="absolute inset-0 z-30 pointer-events-auto flex items-end">
          <div className="w-full text-right p-3 md:p-4">
            <h3 className="text-white text-sm md:text-base font-semibold line-clamp-1">
              {slide.title}
            </h3>
            {slide.description && (
              <p className="text-white/90 mt-1 text-[11px] md:text-sm line-clamp-1">
                {slide.description}
              </p>
            )}
            {slide.button_text && slide.url && (
              <a
                href={slide.url}
                className="inline-block mt-2 bg-white/90 text-primary-container text-xs md:text-sm px-3 py-1 rounded-md font-semibold shadow-sm hover:bg-white transition-colors"
              >
                {slide.button_text}
              </a>
            )}
          </div>
        </div>

        {/* Controls (hidden on small screens) */}
        <button
          aria-label="قبلی"
          onClick={prev}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-40 rounded-full bg-black/30 text-white p-2 hidden md:inline-flex hover:bg-black/50 transition-colors"
        >
          ‹
        </button>
        <button
          aria-label="بعدی"
          onClick={next}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-40 rounded-full bg-black/30 text-white p-2 hidden md:inline-flex hover:bg-black/50 transition-colors"
        >
          ›
        </button>

        {/* Navigation dots */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-40 flex gap-2">
          {sliders.map((s, i) => (
            <button
              key={s.id}
              onClick={() => go(i)}
              aria-label={`اسلاید ${i + 1}`}
              className={`w-2 h-2 rounded-full transition-all ${
                i === index ? "bg-white scale-125" : "bg-white/50 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
