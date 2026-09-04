import React, { useEffect, useRef, useState } from "react";
import { useHomeSliders } from "../hooks/useHomeSliders";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = { intervalMs?: number };

const API_BASE_URL = "https://fitopiaapi.pythonanywhere.com";

export default function PromoSlider({ intervalMs = 6000 }: Props) {
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
      <section className="w-full" aria-busy="true">
        <div className="skeleton w-full rounded-[1.25rem] aspect-[16/10] max-h-[15rem] sm:max-h-[17rem]" />
      </section>
    );
  }

  if (error || count === 0) return null;

  const go = (i: number) => setIndex(((i % count) + count) % count);
  const prev = () => go(index - 1);
  const next = () => go(index + 1);
  const slide = sliders[index];

  const imageUrl = (() => {
    if (!slide.image) return null;
    if (slide.image.startsWith("http")) return slide.image;
    return `${API_BASE_URL}${slide.image}`;
  })();

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(dx) < 36) return;
    if (dx > 0) prev();
    else next();
  };

  return (
    <section aria-roledescription="carousel" aria-label="پیشنهادهای فیتوپیا" className="w-full">
      <div
        className="relative w-full overflow-hidden rounded-[1.25rem] border border-white/8 elevation-2 aspect-[16/10] max-h-[15rem] sm:max-h-[18rem] md:max-h-[20rem]"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            onError={(e) => {
              const t = e.currentTarget;
              t.style.display = "none";
            }}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a120c] via-[#121216] to-[#0a0a0e]" />
        )}

        <div className="hero-overlay absolute inset-0" />
        <div className="pointer-events-none absolute -left-10 top-0 h-40 w-40 rounded-full bg-primary-container/20 blur-3xl" />

        <div className="absolute inset-0 z-10 flex flex-col justify-end p-4 sm:p-5 md:p-6 text-right">
          <h3 className="text-white font-extrabold leading-snug line-clamp-2 text-[clamp(1rem,4.2vw,1.35rem)] max-w-[18rem] sm:max-w-md ms-auto">
            {slide.title}
          </h3>
          {slide.description && (
            <p className="mt-1.5 text-white/70 text-[clamp(0.7rem,3vw,0.875rem)] line-clamp-2 max-w-[17rem] sm:max-w-sm ms-auto leading-relaxed">
              {slide.description}
            </p>
          )}
          {slide.button_text && slide.url && (
            <a
              href={slide.url}
              className="btn btn-primary mt-3 self-start min-h-10 px-4 text-sm no-underline shadow-lg shadow-primary-container/20"
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
              className="absolute left-2 top-1/2 z-20 hidden -translate-y-1/2 md:inline-flex min-w-10 min-h-10 items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/55"
            >
              <ChevronLeft size={18} aria-hidden />
            </button>
            <button
              type="button"
              aria-label="اسلاید بعدی"
              onClick={next}
              className="absolute right-2 top-1/2 z-20 hidden -translate-y-1/2 md:inline-flex min-w-10 min-h-10 items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/55"
            >
              <ChevronRight size={18} aria-hidden />
            </button>
            <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 gap-1.5" role="tablist">
              {sliders.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  aria-label={`اسلاید ${i + 1}`}
                  onClick={() => go(i)}
                  className={`h-1.5 rounded-full transition-all duration-200 ${
                    i === index ? "w-5 bg-[#FF6A00]" : "w-1.5 bg-white/40"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
