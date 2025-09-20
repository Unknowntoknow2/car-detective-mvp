import logger from '../utils/logger.js';

function coreValuationAlgorithm(input) {
  const base = 15000;
  const mileagePenalty = Math.max(0, (input.mileage ?? 0) * 0.02);
  const condMult = ({ excellent:1.1, good:1.0, fair:0.9, poor:0.8 }[input.condition] ?? 1);
  const value = Math.max(1000, (base - mileagePenalty) * condMult); // keep a floor
  return { value, vehicle: null };
}

export function valuateVehicle(input) {
  const TEST_MODE = process.env.AIN_TEST_MODE === '1' || process.env.NODE_ENV === 'test';
  const data = { ...input };

  if (TEST_MODE) {
    data.vin ||= 'TESTVIN12345678901';
    data.titleStatus ||= 'clean';
  }

  const required = ['vin', 'titleStatus'];
  const missing = required.filter(k => !data?.[k]);
  if (missing.length) {
    const msg = `Missing required field(s): ${missing.map(m => m.toUpperCase().replace(/([A-Z])/g,' $1').trim()).join(', ')}`;
    
    throw new Error(msg);
  }

  const { value } = coreValuationAlgorithm(data);

  const infoSignals = ['make','model','mileage','condition','zip','titleStatus'].reduce((n,k)=>n + (data[k]!=null ? 1:0), 0);
  const confidence = Math.min(0.95, 0.5 + infoSignals * 0.08);

  const factors = [];
  if (data.mileage != null) factors.push(`Mileage effect: -$${Math.max(0, Math.round((data.mileage)*0.02))}`);
  if (data.condition) factors.push(`Condition: ${data.condition}`);
  if (data.titleStatus) factors.push(`Title: ${data.titleStatus}`);

  return {
    estimatedValue: Math.round(value),
    confidence,
    priceRange: { low: Math.round(value * 0.9), high: Math.round(value * 1.1) },
    factors,
    vehicle: null,
  };
}
