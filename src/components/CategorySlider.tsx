/**
 * Category chips — uses existing useCategories hook.
 */

import { useState } from "react";
import { useCategories } from "../hooks/useGymAPI";

interface CategorySliderProps {
  onCategoryChange?: (categoryId: number, categoryName: string) => void;
}

export function CategorySlider({ onCategoryChange }: CategorySliderProps) {
  const { categories, loading, error } = useCategories();
  const [activeCategory, setActiveCategory] = useState<number | null>(null);

  const handleSelect = (categoryId: number, categoryName: string) => {
    setActiveCategory((prev) => (prev === categoryId ? null : categoryId));
    onCategoryChange?.(categoryId, categoryName);
  };

  if (loading) {
    return (
      <section className="space-y-3" aria-busy="true">
        <div className="skeleton h-4 w-28 rounded" />
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton h-9 w-20 rounded-full shrink-0" />
          ))}
        </div>
      </section>
    );
  }

  if (error || categories.length === 0) return null;

  return (
    <section className="space-y-3" id="category-slider" aria-label="دسته‌بندی باشگاه‌ها">
      <h2 className="section-title">کشف بر اساس رشته</h2>
      <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1 -mx-0.5 px-0.5">
        {categories.map((cat) => {
          const isActive = cat.id === activeCategory;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => handleSelect(cat.id, cat.title)}
              className={`shrink-0 whitespace-nowrap rounded-full px-3.5 min-h-9 text-xs font-semibold transition-colors border ${
                isActive
                  ? "bg-primary-container/15 border-primary-container/40 text-primary"
                  : "bg-white/[0.04] border-white/10 text-white/80 hover:border-white/20"
              }`}
            >
              {cat.title}
            </button>
          );
        })}
      </div>
    </section>
  );
}
