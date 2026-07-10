import { useState, useEffect } from 'react';

interface Location {
  lat: number | null;
  lon: number | null;
}

export const useUserLocation = () => {
  const [location, setLocation] = useState<Location>({ lat: null, lon: null });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
          setLoading(false);
        },
        (err) => {
          setError('دسترسی به موقعیت مکانی مجاز نیست');
          console.error('Geolocation error:', err);
          setLoading(false);
        }
      );
    } else {
      setError('مرورگر شما از موقعیت مکانی پشتیبانی نمی‌کند');
      setLoading(false);
    }
  }, []);

  return { location, error, loading };
};
