import { useState, useEffect } from 'react';
import axios from 'axios';

export interface Gym {
  id: number;
  name: string;
  description: string;
  address: string;
  phone: string;
  latitude: number;
  longitude: number;
  cover_image: string;
  working_hours: string;
  rules: string;
  instagram: string;
  telegram: string;
  website: string;
  whatsapp: string;
  popularity_score: number;
  is_popular: boolean;
  sports: number[];
  facilities: number[];
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

export const useNearbyGyms = (lat: number | null, lon: number | null) => {
  const [gyms, setGyms] = useState<Gym[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!lat || !lon) return;

    const fetchGyms = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get<Gym[]>(
          `${API_BASE_URL}/api/gym/nearby/?lat=${lat}&lon=${lon}`
        );
        setGyms(response.data || []);
      } catch (err) {
        setError('خطا در بارگذاری باشگاه‌ها');
        console.error('Error fetching gyms:', err);
        setGyms([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGyms();
  }, [lat, lon]);

  return { gyms, loading, error };
};
