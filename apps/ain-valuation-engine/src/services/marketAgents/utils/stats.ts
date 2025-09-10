export function median(nums: number[]): number | null {
  const arr = nums.filter(n => Number.isFinite(n)).slice().sort((a,b) => a-b);
  if (!arr.length) return null;
  const mid = Math.floor(arr.length / 2);
  return arr.length % 2 ? arr[mid] : (arr[mid-1] + arr[mid]) / 2;
}

export function iqrBounds(nums: number[]): {lower: number, upper: number} | null {
  const arr = nums.filter(n => Number.isFinite(n)).slice().sort((a,b) => a-b);
  if (arr.length < 8) return null; // Need a bit of mass for robust IQR
  const q1 = quantile(arr, 0.25);
  const q3 = quantile(arr, 0.75);
  const iqr = q3 - q1;
  return { lower: q1 - 1.5 * iqr, upper: q3 + 1.5 * iqr };
}

function quantile(sorted: number[], q: number): number {
  const pos = (sorted.length - 1) * q;
  const base = Math.floor(pos);
  const rest = pos - base;
  return sorted[base] + (sorted[base + 1] - sorted[base]) * (rest || 0);
}
