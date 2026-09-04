import React, { useEffect, useRef, useState } from "react";
import { useHomeSliders } from "../hooks/useHomeSliders";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  intervalMs?: number;
};

const API_BASE_URL = "https://fitopiaapi.pythonanywhere.com";

export default function PromoSlider({ intervalMs = 5500 }: Props) {
  const { sliders, loading, error } = useHomeSliders();
  const [index, setIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const count = sliders.length;

  useEffect(() => {
    if (count <= 1) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % count), intervalMs);
    return () => clearInterval(t);
  }, [count, intervalMs]);

  if (loading) {
    return (
      <section className="w-full" aria-busy="true" aria-label="در حال بارگذاری اسلایدر">
        <div className="skeleton h-44 md:h-52 w-full rounded-2xl" />
      </section>
    );
  }

  if (error || count === 0) return null;

  const go = (i: number) => setIndex(((i % count) + count) % count);
  const prev = () => go(index - 1);
  const next = () => go(index + 1);
  const slide = sliders[index];

  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return null;
    if (imagePath.startsWith("http")) return imagePath;
    return `${API_BASE_URL}${imagePath}`;
  };

  const imageUrl = getImageUrl(slide.image);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(dx) < 40) return;
    if (dx > 0) prev();
    else next();
  };

  return (
    <section className="w-full" aria-roledescription="carousel" aria-label="پیشنهادهای فیتوپیا">
      <div
        className="relative overflow-hidden rounded-2xl border border-white/8 elevation-2 aspect-[16/9] max-h-56 md:max-h-64"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            onError={(e) => {
              const target = e.currentTarget as HTMLImageElement;
              if (!target.dataset.fallbackApplied) {
                target.dataset.fallbackApplied = "1";
                target.style.display = "none";
              }
            }}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary-container/30 to-surface-container" />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/10" />

        <div className="absolute inset-0 z-10 flex flex-col justify-end p-4 md:p-5 text-right">
          <h3 className="text-white text-base md:text-lg font-bold leading-snug line-clamp-2">
            {slide.title}
          </h3>
          {slide.description && (
            <p className="text-white/75 mt-1 text-xs md:text-sm line-clamp-2 leading-relaxed">
              {slide.description}
            </p>
          )}
          {slide.button_text && slide.url && (
            <a
              href={slide.url}
              className="btn btn-primary mt-3 self-start min-h-10 px-4 text-sm no-underline"
            >
              {slide.button_text}
            </a>
          )}
        </div>

        {count > 1 && (
          <>
            <button
              type="button"
              aria-label="اسلاید قبلی"
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 hidden md:inline-flex min-w-10 min-h-10 items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/55 transition-colors"
            >
              <ChevronLeft size={18} aria-hidden />
            </button>
            <button
              type="button"
              aria-label="اسلاید بعدی"
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 hidden md:inline-flex min-w-10 min-h-10 items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/55 transition-colors"
            >
              <ChevronRight size={18} aria-hidden />
            </button>
          </>
        )}

        {count > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-1.5" role="tablist">
            {sliders.map((s, i) => (
              <button
                key={s.id}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`اسلاید ${i + 1}`}
                onClick={() => go(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === index ? "w-5 bg-primary-container" : "w-1.5 bg-white/45"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
