
export function formatFeatureValue(value: number): string {
  return value >= 0 ? `+$${value}` : `-$${Math.abs(value)}`;
}

export function formatFeatureName(name: string): string {
  return name.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
}
