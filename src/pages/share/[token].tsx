import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getValuationByToken } from '@/services/valuationService';
import { ValuationResultProps } from '@/types/valuation-result';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SectionHeader } from '@/components/ui/design-system';
import { ValuationResult } from '@/modules/valuation-result';

const ValuationSharePage = () => {
  const { token } = useParams<{ token: string }>();
  const [data, setData] = useState<ValuationResultProps | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchValuation = async () => {
      if (!token) {
        setError('No token provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const valuationData = await getValuationByToken(token);
        setData(valuationData);
      } catch (err) {
        setError('Failed to load valuation');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchValuation();
  }, [token]);

  if (loading) {
    return <p>Loading valuation data...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!data) {
    return <p>Valuation not found.</p>;
  }

  return (
    <section className="container grid items-center justify-center gap-6 pt-6 md:pt-10 pb-8 md:pb-14">
      <SectionHeader
        title="Vehicle Valuation Details"
        description="View the details of the shared vehicle valuation"
      />
      <Card className="w-full max-w-lg mx-auto">
        <CardHeader>
          <CardTitle>Valuation Summary</CardTitle>
          <CardDescription>Details for {data.make} {data.model} ({data.year})</CardDescription>
        </CardHeader>
        <CardContent>
          <dl>
            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">Make</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{data.make}</dd>
            </div>
            <div className="mt-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">Model</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{data.model}</dd>
            </div>
            <div className="mt-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">Year</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{data.year}</dd>
            </div>
            <div className="mt-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">Condition</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{data.condition}</dd>
            </div>
            <div className="mt-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">Mileage</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{data.mileage}</dd>
            </div>
            <div className="mt-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">Location</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{data.location}</dd>
            </div>
            <div className="mt-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">Valuation</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{formatCurrency(data.valuation || 0)}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </section>
  );
};

export default ValuationSharePage;
