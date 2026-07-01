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
 * Format date to Persian format (YYYY/MM/DD)
 */
export const formatPersianDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    const persianFormatter = new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });

    return persianFormatter.format(date);
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

/**
 * Calculate days remaining from a date string
 */
export const calculateDaysRemaining = (endDate: string): number => {
  try {
    const end = new Date(endDate);
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
  };
  return labels[status] || status;
};
