import React, { useEffect, useState } from "react";
import type { Promo } from "../data/promo";
import { promoSlides } from "../data/promo";

/**
 * PromoSlider
 * - دریافت آرایهٔ اسلاید (پیش‌فرض از src/data/promo.ts)
 * - auto-play با وقفهٔ 5s
 * - دکمه‌های قبلی/بعدی و دات‌هایی برای ناوبری
 * - طراحی با Tailwind (سفارشی‌سازی آسان)
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
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % count);
    }, intervalMs);
    return () => clearInterval(t);
  }, [count, intervalMs]);

  if (count === 0) return null;

  const go = (i: number) => {
    setIndex(((i % count) + count) % count);
  };

  const prev = () => go(index - 1);
  const next = () => go(index + 1);

  const slide = slides[index];

  return (
    <section className="w-full mb-6">
      <div className="relative rounded-xl overflow-hidden shadow-lg">
        {/* Background image */}
        {slide.image ? (
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-44 md:h-56 lg:h-64 object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-44 md:h-56 lg:h-64 bg-gradient-to-r from-primary/40 to-primary/10" />
        )}

        {/* Overlay content (right-aligned for RTL) */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-l from-black/55 via-transparent to-transparent" />
          <div className="absolute inset-y-0 right-0 flex items-center pr-4 md:pr-8 pointer-events-auto">
            <div className="text-right max-w-xl p-4 md:p-6">
              <h3 className="text-white text-xl md:text-3xl font-extrabold tracking-tight">{slide.title}</h3>
              {slide.subtitle && (
                <p className="text-white/90 mt-1 md:mt-2 text-sm md:text-base">{slide.subtitle}</p>
              )}
              {slide.ctaText && slide.ctaLink && (
                <a
                  href={slide.ctaLink}
                  className="inline-block mt-3 md:mt-4 bg-primary text-black px-4 py-2 rounded-md font-semibold shadow-sm"
                >
                  {slide.ctaText}
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Prev / Next buttons */}
        <button
          aria-label="قبلی"
          onClick={prev}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 rounded-full bg-black/30 text-white p-2 hover:bg-black/45 transition hidden md:inline-flex"
        >
          ‹
        </button>
        <button
          aria-label="بعدی"
          onClick={next}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 rounded-full bg-black/30 text-white p-2 hover:bg-black/45 transition hidden md:inline-flex"
        >
          ›
        </button>

        {/* Dots */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-2">
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
