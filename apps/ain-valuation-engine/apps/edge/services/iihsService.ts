export interface IIHSResult {
  modelYear: number;
  make: string;
  model: string;
  trim?: string;
  crashworthiness: Record<string, string>;
  crash_prevention: Record<string, string>;
  headlights: string | null;
  rawPayload: any;
}

export async function fetchIIHSData({ year, make, model, trim }: { year: number; make: string; model: string; trim?: string }): Promise<IIHSResult | null> {
  // TODO: Implement scraping logic to fetch crashworthiness, crash-prevention, and headlights grades from IIHS.
  return null;
}
