
export function calculateBaseValue(make: string, model: string, year: number): number {
  // Mock implementation
  return 20000;
}

export function applyAdjustment(baseValue: number, adjustment: number): number {
  return baseValue * (1 + adjustment);
}
