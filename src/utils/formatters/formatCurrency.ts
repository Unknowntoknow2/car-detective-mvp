
export function formatCurrency(amount: number | string, options?: {
  currency?: string;
  locale?: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
}): string {
  const {
    currency = 'USD',
    locale = 'en-US',
    minimumFractionDigits = 0,
    maximumFractionDigits = 0,
  } = options || {};

  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

  if (isNaN(numericAmount)) {
    return '$0';
  }

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(numericAmount);
}

export function formatPrice(price: number | string): string {
  return formatCurrency(price, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}
