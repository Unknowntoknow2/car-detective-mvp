
export function sum(values: number[]): number {
  return values.reduce((acc, val) => acc + val, 0);
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
}

export function calculatePercentage(value: number, baseValue: number): number {
  return (value / baseValue) * 100;
}

export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function normalizeValue(value: number, min: number, max: number): number {
  return (value - min) / (max - min);
}
