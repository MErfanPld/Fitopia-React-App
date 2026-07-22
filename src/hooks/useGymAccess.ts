import { useState, useEffect, useCallback } from 'react';
import apiClient from '../services/apiClient';
import type { Coach, Sport } from './useGymAPI';

export interface SportAccess extends Sport {
  has_access?: boolean;
}

export function useGymAccess(gymId?: number) {
  const [sports, setSports] = useState<SportAccess[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAccess = useCallback(async () => {
    if (!gymId) return;
    setLoading(true);
    setError(null);
    try {
      // Preferred endpoint: returns sports with has_access for the current user
      const res = await apiClient.get(`/gym/${gymId}/sports-access/`);
      if (res && res.data && Array.isArray(res.data.sports)) {
        setSports(res.data.sports);
      } else if (res && res.data && res.data.sports === undefined && res.data.sports === null) {
        setSports([]);
      } else {
        // Fallback if server returned gym object (older API)
        if (res && res.data && Array.isArray(res.data.sports)) {
          const mapped = res.data.sports.map((s: any) => ({ ...s, has_access: !!s.has_access }));
          setSports(mapped);
        } else {
          setSports([]);
        }
      }
    } catch (err: any) {
      console.warn('useGymAccess: primary endpoint failed, trying fallback:', err);
      // Fallback: call /gym/{id}/ and mark has_access=false for all sports
      try {
        const fallback = await apiClient.get(`/gym/${gymId}/`);
        const gym = fallback.data;
        if (gym && Array.isArray(gym.sports)) {
          const mapped = gym.sports.map((s: any) => ({ ...s, has_access: false }));
          setSports(mapped);
        } else {
          setSports([]);
        }
      } catch (fallbackErr: any) {
        console.error('useGymAccess fallback failed:', fallbackErr);
        setError(fallbackErr?.message || 'خطا در بارگذاری اطلاعات رشته‌ها');
        setSports(null);
      }
    } finally {
      setLoading(false);
    }
  }, [gymId]);

  useEffect(() => {
    fetchAccess();
  }, [fetchAccess]);

  const hasSportAccess = (sportId: number) => {
    if (!sports) return false;
    const s = sports.find((it) => it.id === sportId);
    return !!(s && s.has_access);
  };

  const fetchCoaches = async (sportId: number): Promise<Coach[]> => {
    // Server must validate access for this user; if forbidden, it should return 403
    const res = await apiClient.get(`/gym/${gymId}/sport/${sportId}/coaches/`);
    if (res && res.data) {
      // Accept either { coaches: [...] } or raw array
      if (Array.isArray(res.data)) return res.data as Coach[];
      if (Array.isArray(res.data.coaches)) return res.data.coaches as Coach[];
      return [];
    }
    return [];
  };

  return { sports, loading, error, hasSportAccess, fetchAccess, fetchCoaches };
}
