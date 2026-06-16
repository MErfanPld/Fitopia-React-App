/**
 * @file CategorySlider.tsx
 * @description Horizontal scrollable filter pills for choosing gym disciplines (e.g., bodybuilding, yoga, martial arts).
 * Integrates an active tab highlighter of the chosen discipline with visual feedback.
 */

import { useState } from "react";

interface CategorySliderProps {
  onCategoryChange?: (category: string) => void; // Optional bubble callback for parent tracking
}

export function CategorySlider({ onCategoryChange }: CategorySliderProps) {
  // Currently highlighted category
  const [activeCategory, setActiveCategory] = useState("بدنسازی");

  // Pre-configured partner gym disciplines in Tehran/IR
  const categories = ["بدنسازی", "یوگا", "کراسفیت", "فیتنس", "رزمی", "شنا"];

  const handleSelect = (cat: string) => {
    setActiveCategory(cat);
    if (onCategoryChange) {
      onCategoryChange(cat);
    }
  };

  return (
    <section className="mt-10 fade-in-up select-none" style={{ animationDelay: "0.3s" }} id="category-slider">
      <h4 className="font-headline-md text-headline-md text-on-surface mb-4">دسته‌بندی باشگاه‌ها</h4>
      
      <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2 relative z-10">
        {categories.map((cat) => {
          const isActive = cat === activeCategory;
          return (
            <button
              key={cat}
              onClick={() => handleSelect(cat)}
              className={`whitespace-nowrap px-6 py-2 rounded-full transition-all duration-300 cursor-pointer ${
                isActive
                  ? "bg-primary/10 border border-primary/30 text-primary shadow-[0_0_15px_rgba(255,182,148,0.2)]"
                  : "glass-card text-on-surface-variant/70 hover:border-primary/20 transition-colors"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </section>
  );
}
