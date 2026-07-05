/**
 * Formatting utility functions for Persian display
 */

/**
 * Convert numbers to Persian numerals
 */
export const formatPersianNumber = (num: number | string): string => {
  if (typeof num === 'string') {
    num = parseFloat(num);
  }

  if (isNaN(num)) {
    return '۰';
  }

  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  const formattedNum = new Intl.NumberFormat('fa-IR').format(num);

  return formattedNum
    .split('')
    .map((digit) => {
      const englishDigit = parseInt(digit);
      return !isNaN(englishDigit) ? persianDigits[englishDigit] : digit;
    })
    .join('');
};

/**
 * Format date to Persian format (YYYY/MM/DD HH:MM)
 * Safely handles invalid dates
 */
export const formatPersianDate = (dateString: string | null | undefined): string => {
  try {
    if (!dateString) {
      return '---';
    }

    const date = new Date(dateString);
    
    // بررسی تاریخ invalid
    if (isNaN(date.getTime())) {
      console.warn('Invalid date string:', dateString);
      return '---';
    }

    const persianFormatter = new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });

    return persianFormatter.format(date);
  } catch (error) {
    console.error('Error formatting date:', dateString, error);
    return '---';
  }
};

/**
 * Format date to short Persian format (YYYY/MM/DD)
 */
export const formatPersianDateShort = (dateString: string | null | undefined): string => {
  try {
    if (!dateString) {
      return '---';
    }

    const date = new Date(dateString);
    
    // بررسی تاریخ invalid
    if (isNaN(date.getTime())) {
      console.warn('Invalid date string:', dateString);
      return '---';
    }

    const persianFormatter = new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });

    return persianFormatter.format(date);
  } catch (error) {
    console.error('Error formatting date:', dateString, error);
    return '---';
  }
};

/**
 * Calculate days remaining from a date string
 */
export const calculateDaysRemaining = (endDate: string): number => {
  try {
    if (!endDate) {
      return 0;
    }

    const end = new Date(endDate);
    
    if (isNaN(end.getTime())) {
      return 0;
    }

    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  } catch (error) {
    console.error('Error calculating days remaining:', error);
    return 0;
  }
};

/**
 * Get status label in Persian
 */
export const getStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    active: 'فعال',
    expired: 'پایان یافته',
    cancelled: 'لغوشده',
    used: 'استفاده‌شده',
  };
  return labels[status] || status;
};
