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
    // Request location with timeout
    if (navigator.geolocation) {
      const timeout = setTimeout(() => {
        setError('درخواست موقعیت مکانی تایم اوت شد');
        setLoading(false);
      }, 10000); // 10 second timeout

      navigator.geolocation.getCurrentPosition(
        (position) => {
          clearTimeout(timeout);
          console.log('Location obtained:', position.coords);
          setLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
          setLoading(false);
          setError(null);
        },
        (err) => {
          clearTimeout(timeout);
          console.error('Geolocation error:', err);
          
          // Provide more specific error messages
          switch (err.code) {
            case err.PERMISSION_DENIED:
              setError('دسترسی به موقعیت مکانی رد شده است. لطفاً مجوز را فعال کنید.');
              break;
            case err.POSITION_UNAVAILABLE:
              setError('موقعیت مکانی در دسترس نیست.');
              break;
            case err.TIMEOUT:
              setError('درخواست موقعیت مکانی تایم اوت شد.');
              break;
            default:
              setError('خطا در دریافت موقعیت مکانی');
          }
          setLoading(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    } else {
      setError('مرورگر شما از موقعیت مکانی پشتیبانی نمی‌کند');
      setLoading(false);
    }
  }, []);

  return { location, error, loading };
};
