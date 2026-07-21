/**
 * @file useHomeSliders.ts
 * @description Custom hook for fetching and managing home sliders
 */

import { useState, useEffect } from 'react';
import { sliderService } from '../services/sliderService';
import type { HomeSlider } from '../types/slider';

interface UseHomeSlidersReturn {
  sliders: HomeSlider[];
  loading: boolean;
  error: string | null;
}

export function useHomeSliders(): UseHomeSlidersReturn {
  const [sliders, setSliders] = useState<HomeSlider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await sliderService.getHomeSliders();
        
        // Filter only active sliders and sort by order
        const activeSliders = data
          .filter((slider) => slider.is_active)
          .sort((a, b) => a.order - b.order);
        
        setSliders(activeSliders);
      } catch (err: any) {
        console.error('Failed to load home sliders:', err);
        setError(err.message || 'Failed to load sliders');
        setSliders([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { sliders, loading, error };
}
