/**
 * @file CategorySlider.tsx
 * @description Horizontal scrollable filter pills for choosing gym disciplines (e.g., bodybuilding, yoga, martial arts).
 * Fetches categories from API and displays them with visual feedback on selection.
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
    setActiveCategory(categoryId);
    if (onCategoryChange) {
      onCategoryChange(categoryId, categoryName);
    }
  };

  if (loading) {
    return (
      <section className="mt-10 fade-in-up select-none" id="category-slider">
        <h4 className="font-headline-md text-headline-md text-on-surface mb-4">دسته‌بندی باشگاه‌ها</h4>
        <div className="flex gap-3 pb-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-10 w-24 bg-surface-variant/20 rounded-full animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mt-10 fade-in-up select-none" id="category-slider">
        <h4 className="font-headline-md text-headline-md text-on-surface mb-4">دسته‌بندی باشگاه‌ها</h4>
        <div className="p-4 bg-error/10 rounded-lg text-error text-sm">
          خطا در بارگذاری دسته‌بندی‌ها: {error}
        </div>
      </section>
    );
  }

  return (
    <section className="mt-10 fade-in-up select-none" style={{ animationDelay: "0.3s" }} id="category-slider">
      <h4 className="font-headline-md text-headline-md text-on-surface mb-4">دسته‌بندی باشگاه‌ها</h4>
      
      <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2 relative z-10 md:flex-wrap md:overflow-visible">
        {categories.length === 0 ? (
          <p className="text-on-surface-variant/70">دسته‌بندی‌ای یافت نشد</p>
        ) : (
          categories.map((cat) => {
            const isActive = cat.id === activeCategory;
            return (
              <button
                key={cat.id}
                onClick={() => handleSelect(cat.id, cat.title)}
                className={`whitespace-nowrap px-6 py-2 rounded-full transition-all duration-300 cursor-pointer ${
                  isActive
                    ? "bg-primary/10 border border-primary/30 text-primary shadow-[0_0_15px_rgba(255,182,148,0.2)]"
                    : "glass-card text-on-surface-variant/70 hover:border-primary/20 transition-colors"
                }`}
              >
                {cat.title}
              </button>
            );
          })
        )}
      </div>
    </section>
  );
}
