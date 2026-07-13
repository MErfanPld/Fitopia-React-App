// src/services/tokenService.ts
import { Token } from '../types/token';

// تابع کمکی برای دریافت توکن احراز هویت
const getAuthToken = (): string => {
  const token = localStorage.getItem('accessToken') || localStorage.getItem('access') || '';
  return token;
};

// تابع مدیریت خطا
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
    if (response.status === 401) {
      errorMessage = 'لطفاً دوباره وارد حساب کاربری خود شوید.';
    } else if (response.status === 404) {
      errorMessage = 'توکنی یافت نشد.';
    }
  }
  
  throw new Error(errorMessage);
};

export const tokenService = {
  // دریافت لیست توکن‌های کاربر
  async getMyTokens(): Promise<Token[]> {
    const token = getAuthToken();
    
    console.log('🌐 Fetching tokens from API...');
    
    const response = await fetch(
      'https://fitopiaapi.pythonanywhere.com/api/tokens/my/',
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      }
    );

    console.log('📡 Tokens Response Status:', response.status);

    if (!response.ok) {
      await handleApiError(response);
    }

    return response.json();
  },

  // دریافت تعداد توکن‌های فعال
  async getActiveTokensCount(): Promise<number> {
    try {
      const tokens = await this.getMyTokens();
      // فقط توکن‌های فعال و معتبر رو بشمار
      const activeTokens = tokens.filter(t => t.status === 'active' && t.is_valid === true);
      return activeTokens.length;
    } catch (error) {
      console.error('Error fetching tokens:', error);
      return 0;
    }
  },

  // دریافت یک توکن جدید (شارژ)
  async purchaseToken(gymId?: number): Promise<Token> {
    const token = getAuthToken();
    
    const response = await fetch(
      'https://fitopiaapi.pythonanywhere.com/api/tokens/purchase/',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ gym_id: gymId || null }),
      }
    );

    if (!response.ok) {
      await handleApiError(response);
    }

    return response.json();
  },
};