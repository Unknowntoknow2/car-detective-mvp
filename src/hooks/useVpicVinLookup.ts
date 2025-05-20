import { useState } from 'react';

export function useVinLookup() {
  const [loading, setLoading] = useState(false);
  const [carData, setCarData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  async function lookupVin(vin: string) {
    setLoading(true);
    setError(null);
    setCarData(null);
    try {
      const res = await fetch('/functions/v1/unified-decode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vin }),
      });
      const json = await res.json();
      if (json.success) setCarData(json.nhtsaData); // Adjust to your result shape
      else setError(json.error || 'Unknown error');
    } catch (e: any) {
      setError(e.message || String(e));
    } finally {
      setLoading(false);
    }
  }

  return { loading, carData, error, lookupVin };
}
