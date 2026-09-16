import { useState, useEffect, useCallback } from "react";
import apiClient from "../services/apiClient";
import type { Coach, Sport } from "./useGymAPI";

export interface SportAccess extends Sport {
  has_access?: boolean;
}

export interface SportScheduleItem {
  day_of_week: number;
  start_time: string;
  end_time: string;
  gender_restriction?: string;
}

export interface SportScheduleResponse {
  gym?: { id: number; name: string };
  sport?: { id: number; name: string };
  gender_restriction?: string;
  schedules: SportScheduleItem[];
}

const DAY_FA = ["شنبه", "یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنجشنبه", "جمعه"];

export function dayOfWeekFa(day: number): string {
  if (day >= 0 && day < DAY_FA.length) return DAY_FA[day];
  return String(day);
}

export function formatTimeFa(t?: string): string {
  if (!t) return "—";
  // "08:00:00" → "۰۸:۰۰"
  const parts = t.split(":");
  if (parts.length >= 2) return `${parts[0]}:${parts[1]}`;
  return t;
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
      const res = await apiClient.get(`/gym/${gymId}/sports-access/`);
      const list = res?.data?.sports;
      if (Array.isArray(list)) {
        setSports(
          list.map((s: SportAccess) => ({
            ...s,
            has_access: !!s.has_access,
          })),
        );
      } else {
        setSports([]);
      }
    } catch (err: unknown) {
      console.warn("useGymAccess: sports-access failed, fallback to gym detail", err);
      try {
        const fallback = await apiClient.get(`/gym/${gymId}/`);
        const gym = fallback.data;
        if (gym && Array.isArray(gym.sports)) {
          setSports(gym.sports.map((s: SportAccess) => ({ ...s, has_access: false })));
        } else {
          setSports([]);
        }
      } catch (fallbackErr: unknown) {
        const msg =
          fallbackErr instanceof Error
            ? fallbackErr.message
            : "خطا در بارگذاری اطلاعات رشته‌ها";
        setError(msg);
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

  /** GET /api/gym/{id}/sport/{sportId}/coaches/ */
  const fetchCoaches = async (sportId: number): Promise<Coach[]> => {
    const res = await apiClient.get(`/gym/${gymId}/sport/${sportId}/coaches/`);
    if (!res?.data) return [];
    if (Array.isArray(res.data)) return res.data as Coach[];
    if (Array.isArray(res.data.coaches)) return res.data.coaches as Coach[];
    return [];
  };

  /** GET /api/gym/{id}/sport/{sportId}/schedule/ */
  const fetchSchedule = async (sportId: number): Promise<SportScheduleResponse> => {
    const res = await apiClient.get(`/gym/${gymId}/sport/${sportId}/schedule/`);
    const data = res?.data ?? {};
    return {
      gym: data.gym,
      sport: data.sport,
      gender_restriction: data.gender_restriction,
      schedules: Array.isArray(data.schedules) ? data.schedules : [],
    };
  };

  return {
    sports,
    loading,
    error,
    hasSportAccess,
    fetchAccess,
    fetchCoaches,
    fetchSchedule,
  };
}
