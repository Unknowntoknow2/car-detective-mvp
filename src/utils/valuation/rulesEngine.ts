
export interface ValuationRule {
  name: string;
  condition: (data: any) => boolean;
  adjustment: number;
}

export const valuationRules: ValuationRule[] = [
  {
    name: 'High Mileage',
    condition: (data) => data.mileage > 100000,
    adjustment: -0.1
  },
  {
    name: 'Excellent Condition',
    condition: (data) => data.condition === 'excellent',
    adjustment: 0.1
  }
];

export function applyValuationRules(baseValue: number, data: any): number {
  let adjustedValue = baseValue;
  
  for (const rule of valuationRules) {
    if (rule.condition(data)) {
      adjustedValue *= (1 + rule.adjustment);
    }
  }
  
  return adjustedValue;
}
