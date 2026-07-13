// src/services/gymService.ts
import { Gym } from '../types/gym';

// تابع کمکی برای دریافت توکن از localStorage
const getAuthToken = (): string => {
  return localStorage.getItem('accessToken') || '';
};

// تابع کمکی برای مدیریت خطاهای API
const handleApiError = async (response: Response): Promise<never> => {
  let errorMessage = 'مشکلی در ارتباط با سرور پیش آمده است.';
  
  try {
    const errorData = await response.json();
    if (errorData.detail) {
      errorMessage = errorData.detail;
    } else if (errorData.message) {
      errorMessage = errorData.message;
    }
  } catch (_) {
    // اگر پاسخ JSON نبود، از متن خطای HTTP استفاده کن
    if (response.status === 401) {
      errorMessage = 'لطفاً دوباره وارد حساب کاربری خود شوید.';
    } else if (response.status === 404) {
      errorMessage = 'آدرس درخواستی پیدا نشد.';
    } else if (response.status === 500) {
      errorMessage = 'خطای داخلی سرور. لطفاً بعداً تلاش کنید.';
    }
  }
  
  throw new Error(errorMessage);
};

export const gymService = {
  // دریافت باشگاه‌های نزدیک بر اساس موقعیت
  async getNearbyGyms(lat: number, lon: number, radius: number = 10): Promise<Gym[]> {
    const token = getAuthToken();
    
    const response = await fetch(
      `https://fitopiaapi.pythonanywhere.com/api/gym/nearby/?lat=${lat}&lon=${lon}&radius=${radius}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      await handleApiError(response);
    }

    return response.json();
  },

  // دریافت اطلاعات یک باشگاه با آیدی
  async getGymById(gymId: number): Promise<Gym> {
    const token = getAuthToken();
    
    const response = await fetch(
      `https://fitopiaapi.pythonanywhere.com/api/gym/${gymId}/`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      await handleApiError(response);
    }

    return response.json();
  },

  // جستجوی باشگاه‌ها بر اساس نام یا آدرس
  async searchGyms(query: string): Promise<Gym[]> {
    const token = getAuthToken();
    
    const response = await fetch(
      `https://fitopiaapi.pythonanywhere.com/api/gym/search/?q=${encodeURIComponent(query)}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      await handleApiError(response);
    }

    return response.json();
  },
};
