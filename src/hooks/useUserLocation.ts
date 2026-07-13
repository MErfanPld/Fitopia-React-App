// src/hooks/useUserLocation.ts
import { useState, useEffect, useCallback } from 'react';

interface Location {
  lat: number;
  lon: number;
}

interface UseUserLocationResult {
  location: Location;
  loading: boolean;
  error: string | null;
  retry: () => void;
  isFallback: boolean;
}

// موقعیت پیش‌فرض (تهران)
const DEFAULT_LOCATION: Location = {
  lat: 35.6892,
  lon: 51.389,
};

export function useUserLocation(): UseUserLocationResult {
  const [location, setLocation] = useState<Location>(DEFAULT_LOCATION);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isFallback, setIsFallback] = useState<boolean>(false);

  const getLocation = useCallback(() => {
    // اگر مرورگر از GeoLocation پشتیبانی نمی‌کند
    if (!navigator.geolocation) {
      setError('مرورگر شما از موقعیت‌یابی پشتیبانی نمی‌کند.');
      setLoading(false);
      setIsFallback(true);
      return;
    }

    setLoading(true);
    setError(null);
    setIsFallback(false);

    // تنظیم تایم‌اوت برای درخواست موقعیت (۱۰ ثانیه)
    const timeoutId = setTimeout(() => {
      setError('درخواست موقعیت تایم‌اوت شد. استفاده از موقعیت پیش‌فرض.');
      setIsFallback(true);
      setLoading(false);
      setLocation(DEFAULT_LOCATION);
    }, 10000);

    navigator.geolocation.getCurrentPosition(
      // موفقیت
      (position) => {
        clearTimeout(timeoutId);
        setLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
        setIsFallback(false);
        setLoading(false);
      },
      // خطا
      (err) => {
        clearTimeout(timeoutId);
        let errorMessage = 'خطا در دریافت موقعیت. استفاده از موقعیت پیش‌فرض.';
        
        switch (err.code) {
          case err.PERMISSION_DENIED:
            errorMessage = 'دسترسی به موقعیت رد شد. لطفاً دسترسی را در مرورگر فعال کنید.';
            break;
          case err.POSITION_UNAVAILABLE:
            errorMessage = 'موقعیت در دسترس نیست. استفاده از موقعیت پیش‌فرض.';
            break;
          case err.TIMEOUT:
            errorMessage = 'درخواست موقعیت تایم‌اوت شد. استفاده از موقعیت پیش‌فرض.';
            break;
        }
        
        setError(errorMessage);
        setIsFallback(true);
        setLocation(DEFAULT_LOCATION);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 8000, // ۸ ثانیه
        maximumAge: 60000, // ۱ دقیقه کش
      }
    );
  }, []);

  useEffect(() => {
    getLocation();
  }, [getLocation]);

  return { location, loading, error, retry: getLocation, isFallback };
}