// CohortStats: Valuation read API for cohort stats (median, IQR, count, etc.)
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function getCohortStats({ zip, radius, make, model, year }: { zip: string, radius: number, make?: string, model?: string, year?: number }) {
  // Query listings table for cohort
  const { data, error } = await supabase
    .from('listings')
    .select('price, mileage')
    .eq('zip', zip)
    .gte('radius', radius)
    .eq('make', make)
    .eq('model', model)
    .eq('year', year)
    .limit(1000);
  if (error) throw error;
  const prices = data.map((r: any) => r.price).filter(Number.isFinite);
  const miles = data.map((r: any) => r.mileage).filter(Number.isFinite);
  const med = (arr: number[]) => arr.length ? arr.sort((a,b)=>a-b)[Math.floor(arr.length/2)] : null;
  const iqr = (arr: number[]) => {
    if (!arr.length) return null;
    const sorted = arr.slice().sort((a,b)=>a-b);
    const q1 = sorted[Math.floor(sorted.length/4)];
    const q3 = sorted[Math.floor(3*sorted.length/4)];
    return q3 - q1;
  };
  return {
    count: prices.length,
    medians: { price: med(prices), mileage: med(miles) },
    iqr: { price: iqr(prices), mileage: iqr(miles) },
    sample: data.slice(0,3)
  };
}
