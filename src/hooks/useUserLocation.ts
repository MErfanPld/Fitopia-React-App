import { useState, useEffect } from 'react';

interface Location {
  lat: number | null;
  lon: number | null;
}

// Default locations for major Iranian cities
const DEFAULT_LOCATIONS: { [key: string]: Location } = {
  tehran: { lat: 35.6892, lon: 51.389 },
  isfahan: { lat: 32.6546, lon: 51.6243 },
  shiraz: { lat: 29.5832, lon: 52.5836 },
  mashhad: { lat: 36.2671, lon: 59.6074 },
  tabriz: { lat: 38.0883, lon: 46.2919 },
};

export const useUserLocation = () => {
  const [location, setLocation] = useState<Location>({ lat: null, lon: null });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUsingDefault, setIsUsingDefault] = useState(false);

  useEffect(() => {
    if (navigator.geolocation) {
      // Try to get actual location with shorter timeout
      const timeoutId = setTimeout(() => {
        console.log('Geolocation timeout - using default location');
        // Use Tehran as default if timeout
        setLocation(DEFAULT_LOCATIONS.tehran);
        setIsUsingDefault(true);
        setLoading(false);
        setError('استفاده از موقعیت پیش‌فرض (تهران). برای دقت بیشتر مجوز را فعال کنید.');
      }, 5000); // 5 second timeout

      navigator.geolocation.getCurrentPosition(
        (position) => {
          clearTimeout(timeoutId);
          console.log('Location obtained:', position.coords);
          setLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
          setLoading(false);
          setError(null);
          setIsUsingDefault(false);
        },
        (err) => {
          clearTimeout(timeoutId);
          console.error('Geolocation error:', err);
          
          // Use default location on error
          setLocation(DEFAULT_LOCATIONS.tehran);
          setIsUsingDefault(true);
          setLoading(false);

          // Provide more specific error messages
          switch (err.code) {
            case err.PERMISSION_DENIED:
              setError('دسترسی به موقعیت مکانی رد شده. استفاده از تهران به‌عنوان موقعیت پیش‌فرض.');
              break;
            case err.POSITION_UNAVAILABLE:
              setError('موقعیت مکانی در دسترس نیست. استفاده از تهران به‌عنوان موقعیت پیش‌فرض.');
              break;
            case err.TIMEOUT:
              setError('درخواست موقعیت تایم اوت شد. استفاده از تهران به‌عنوان موقعیت پیش‌فرض.');
              break;
            default:
              setError('خطا در دریافت موقعیت. استفاده از تهران به‌عنوان موقعیت پیش‌فرض.');
          }
        },
        {
          enableHighAccuracy: false, // Set to false to be faster
          timeout: 5000, // 5 second timeout
          maximumAge: 0,
        }
      );

      return () => {
        clearTimeout(timeoutId);
      };
    } else {
      setError('مرورگر شما از موقعیت مکانی پشتیبانی نمی‌کند. استفاده از تهران.');
      setLocation(DEFAULT_LOCATIONS.tehran);
      setIsUsingDefault(true);
      setLoading(false);
    }
  }, []);

  return { location, error, loading, isUsingDefault };
};
