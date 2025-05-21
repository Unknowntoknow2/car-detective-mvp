
// Fix the sum and adj parameters:
const totalAdjustments = adjustments?.reduce((sum: number, adj: any) => sum + (adj.impact || 0), 0) || 0;

// Fix the string | null vs string | undefined issue:
const vehicleName = make && model ? `${year} ${make} ${model}` : undefined;
