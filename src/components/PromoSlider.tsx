import React, { useEffect, useState } from "react";
import type { Promo } from "../data/promo";
import { promoSlides } from "../data/promo";

/**
 * PromoSlider
 * - نمایش سادهٔ تصویر پس‌زمینه با نوشتهٔ کوچک "سلام کاربر" در بالا
 * - استفاده از تصاویر کم‌حجم (promo.ts) برای بارگذاری سریع
 */

type Props = {
  slides?: Promo[];
  intervalMs?: number;
};

export default function PromoSlider({ slides = promoSlides, intervalMs = 5000 }: Props) {
  const [index, setIndex] = useState(0);
  const count = slides.length;

  useEffect(() => {
    if (count <= 1) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % count), intervalMs);
    return () => clearInterval(t);
  }, [count, intervalMs]);

  if (count === 0) return null;

  const go = (i: number) => setIndex(((i % count) + count) % count);
  const prev = () => go(index - 1);
  const next = () => go(index + 1);
  const slide = slides[index];

  return (
    <section className="w-full mb-6">
      <div className="relative rounded-xl overflow-hidden shadow-lg h-40 md:h-48 lg:h-56">
        {/* Background image (no overlays) */}
        {slide.image ? (
          <img
            src={slide.image}
            alt={slide.title}
            className="absolute inset-0 w-full h-full object-cover z-0"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 w-full h-full bg-surface z-0" />
        )}

        {/* Small greeting (top-right) */}
        <div className="absolute top-3 right-3 z-30 pointer-events-none">
          <div className="bg-black/30 text-white text-xs px-2 py-0.5 rounded-md backdrop-blur-sm font-medium">
            سلام کاربر
          </div>
        </div>

        {/* Compact content area (bottom-right) */}
        <div className="absolute inset-0 z-30 pointer-events-auto flex items-end">
          <div className="w-full text-right p-3 md:p-4">
            <h3 className="text-white text-sm md:text-base font-semibold line-clamp-1">{slide.title}</h3>
            {slide.subtitle && (
              <p className="text-white/90 mt-1 text-[11px] md:text-sm line-clamp-1">{slide.subtitle}</p>
            )}
            {slide.ctaText && slide.ctaLink && (
              <a
                href={slide.ctaLink}
                className="inline-block mt-2 bg-white/90 text-primary-container text-xs md:text-sm px-3 py-1 rounded-md font-semibold shadow-sm"
              >
                {slide.ctaText}
              </a>
            )}
          </div>
        </div>

        {/* Controls (hidden on small screens) */}
        <button aria-label="قبلی" onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 z-40 rounded-full bg-black/30 text-white p-2 hidden md:inline-flex">
          ‹
        </button>
        <button aria-label="بعدی" onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 z-40 rounded-full bg-black/30 text-white p-2 hidden md:inline-flex">
          ›
        </button>

        {/* Dots */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-40 flex gap-2">
          {slides.map((s, i) => (
            <button
              key={s.id ?? i}
              onClick={() => go(i)}
              aria-label={`اسلاید ${i + 1}`}
              className={`w-2 h-2 rounded-full transition-all ${i === index ? "bg-white scale-125" : "bg-white/50"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
