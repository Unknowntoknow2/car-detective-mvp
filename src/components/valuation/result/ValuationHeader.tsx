
import React from 'react';

interface ValuationHeaderProps {
  year: number;
  make: string;
  model: string;
  mileage: number;
  condition: string;
  location: string;
  valuation: number;
}

export const ValuationHeader: React.FC<ValuationHeaderProps> = ({
  year,
  make,
  model,
  mileage,
  condition,
  location,
  valuation,
}) => {
  return (
    <>
      <h2 className="text-2xl font-semibold mb-2">Valuation Result</h2>
      <p className="mb-4">
        A {year} {make} {model} with {mileage.toLocaleString()} miles in{' '}
        <span className="capitalize">{condition}</span> condition in {location} is
        valued at <span className="font-bold">${valuation.toLocaleString()}</span>.
      </p>
    </>
  );
};
