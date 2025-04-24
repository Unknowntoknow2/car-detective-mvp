
export function getTrimAdjustment(make: string, model: string, trim: string, basePrice: number): number {
  const trimData: Record<string, Record<string, Array<{trim: string; percent: number}>>> = {
    'Toyota': {
      'Camry': [
        { trim: 'LE', percent: -0.05 },
        { trim: 'SE', percent: 0 },
        { trim: 'XLE', percent: 0.07 },
        { trim: 'XSE', percent: 0.10 }
      ],
      'RAV4': [
        { trim: 'LE', percent: -0.05 },
        { trim: 'XLE', percent: 0 },
        { trim: 'Adventure', percent: 0.07 },
        { trim: 'Limited', percent: 0.10 },
        { trim: 'TRD Off-Road', percent: 0.15 }
      ]
    },
    'Honda': {
      'Civic': [
        { trim: 'LX', percent: -0.03 },
        { trim: 'Sport', percent: 0 },
        { trim: 'EX', percent: 0.05 },
        { trim: 'Touring', percent: 0.10 }
      ]
    }
  };
  
  const modelTrimData = trimData[make]?.[model];
  if (!modelTrimData) return 0;
  
  const trimAdjustment = modelTrimData.find(t => t.trim.toLowerCase() === trim.toLowerCase());
  return trimAdjustment ? basePrice * trimAdjustment.percent : 0;
}
