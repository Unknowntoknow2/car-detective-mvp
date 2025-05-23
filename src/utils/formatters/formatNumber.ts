
/**
 * Format a number with thousands separators and decimals
 * @param value - The numeric value to format
 * @param decimals - Number of decimal places (default: 0)
 * @param locale - The locale to use (default: en-US)
 * @returns Formatted number string
 */
export const formatNumber = (
  value: number | null | undefined,
  decimals: number = 0,
  locale: string = 'en-US'
): string => {
  // Handle invalid values
  if (value === null || value === undefined || isNaN(Number(value))) {
    return '0';
  }
  
  try {
    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(Number(value));
  } catch (error) {
    console.error('Error formatting number:', error);
    return value.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
};

/**
 * Format a number as a percentage
 * @param value - The numeric value to format (e.g., 0.25 for 25%)
 * @param decimals - Number of decimal places (default: 1)
 * @param locale - The locale to use (default: en-US)
 * @returns Formatted percentage string
 */
export const formatPercent = (
  value: number | null | undefined,
  decimals: number = 1,
  locale: string = 'en-US'
): string => {
  // Handle invalid values
  if (value === null || value === undefined || isNaN(Number(value))) {
    return '0%';
  }
  
  try {
    return new Intl.NumberFormat(locale, {
      style: 'percent',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(Number(value));
  } catch (error) {
    console.error('Error formatting percentage:', error);
    return `${(Number(value) * 100).toFixed(decimals)}%`;
  }
};

/**
 * Format a large number with abbreviated suffixes (K, M, B)
 * @param value - The numeric value to format
 * @param decimals - Number of decimal places (default: 1)
 * @returns Formatted abbreviated number (e.g., 1.2K, 3.4M)
 */
export const formatCompactNumber = (
  value: number | null | undefined,
  decimals: number = 1
): string => {
  // Handle invalid values
  if (value === null || value === undefined || isNaN(Number(value))) {
    return '0';
  }
  
  const num = Number(value);
  
  try {
    return new Intl.NumberFormat('en-US', {
      notation: 'compact',
      maximumFractionDigits: decimals
    }).format(num);
  } catch (error) {
    console.error('Error formatting compact number:', error);
    
    // Fallback implementation
    const absValue = Math.abs(num);
    if (absValue >= 1_000_000_000) {
      return `${(num / 1_000_000_000).toFixed(decimals)}B`;
    } else if (absValue >= 1_000_000) {
      return `${(num / 1_000_000).toFixed(decimals)}M`;
    } else if (absValue >= 1_000) {
      return `${(num / 1_000).toFixed(decimals)}K`;
    }
    return num.toFixed(decimals);
  }
};
