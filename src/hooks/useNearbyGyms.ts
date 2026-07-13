// src/hooks/useNearbyGyms.ts
import { useState, useEffect, useCallback } from 'react';
import { gymService } from '../services/gymService';
import { Gym } from '../types/gym';

interface UseNearbyGymsResult {
  gyms: Gym[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useNearbyGyms(lat: number, lon: number): UseNearbyGymsResult {
  const [gyms, setGyms] = useState<Gym[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGyms = useCallback(async () => {
    // اگر موقعیت معتبر نبود، کاری نکن
    if (!lat || !lon) {
      setError('موقعیت مکانی در دسترس نیست.');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const data = await gymService.getNearbyGyms(lat, lon);
      setGyms(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطای ناشناخته در دریافت باشگاه‌ها');
      setGyms([]);
    } finally {
      setLoading(false);
    }
  }, [lat, lon]);

  useEffect(() => {
    fetchGyms();
  }, [fetchGyms]);

  return { gyms, loading, error, refetch: fetchGyms };
}