
// Format currency values
export function formatCurrency(value: number, locale = 'en-US', currency = 'USD'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
}

// Format dates
export function formatDate(dateString: string, format: 'short' | 'medium' | 'long' = 'medium'): string {
  const date = new Date(dateString);
  
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: format === 'short' ? 'short' : 'long',
    day: 'numeric',
    hour: format !== 'long' ? undefined : '2-digit',
    minute: format !== 'long' ? undefined : '2-digit'
  };
  
  return new Intl.DateTimeFormat('en-US', options).format(date);
}

// Format percentage values
export function formatPercentage(value: number, decimals = 0): string {
  return `${value.toFixed(decimals)}%`;
}

// Format numbers with commas
export function formatNumber(value: number): string {
  return new Intl.NumberFormat().format(value);
}

// Format file size
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Format vehicle condition labels
export function formatCondition(condition: string): string {
  const conditionMap: Record<string, string> = {
    'excellent': 'Excellent',
    'good': 'Good',
    'fair': 'Fair',
    'poor': 'Poor'
  };
  
  return conditionMap[condition.toLowerCase()] || condition;
}

// Format phone numbers
export function formatPhoneNumber(phoneNumber: string): string {
  const cleaned = ('' + phoneNumber).replace(/\D/g, '');
  
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
  } else if (cleaned.length === 11 && cleaned[0] === '1') {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7, 11)}`;
  }
  
  return phoneNumber;
}

// Format VIN with space every 5 characters
export function formatVIN(vin: string): string {
  return vin.replace(/(.{5})/g, '$1 ').trim();
}
