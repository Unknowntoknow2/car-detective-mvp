
import React, { useState, useEffect } from 'react';
import { generateValuationExplanation } from '@/utils/generateValuationExplanation';

interface ValuationResultProps {
  make: string;
  model: string;
  year: number;
  mileage: number;
  condition: string;
  location: string;
  valuation: number;
}

const ValuationResult: React.FC<ValuationResultProps> = ({
  make,
  model,
  year,
  mileage,
  condition,
  location,
  valuation,
}) => {
  const [explanation, setExplanation] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    async function fetchExplanation() {
      setLoading(true);
      setError('');
      try {
        const result = await generateValuationExplanation({
          make,
          model,
          year,
          mileage,
          condition,
          location,
          valuation,
        });
        setExplanation(result);
      } catch (e: any) {
        console.error(e);
        setError('Failed to load explanation.');
      } finally {
        setLoading(false);
      }
    }
    fetchExplanation();
  }, [make, model, year, mileage, condition, location, valuation]);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-2">Valuation Result</h2>
      <p className="mb-4">
        A {year} {make} {model} with {mileage.toLocaleString()} miles in{' '}
        <span className="capitalize">{condition}</span> condition in {location} is
        valued at <span className="font-bold">${valuation.toLocaleString()}</span>.
      </p>
      {loading ? (
        <p>Loading explanation...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div>
          <h3 className="text-xl font-medium mb-2">Why this price?</h3>
          <p>{explanation}</p>
        </div>
      )}
    </div>
  );
};

export default ValuationResult;
