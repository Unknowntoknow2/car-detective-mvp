
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDealerInsights } from '@/hooks/useDealerInsights';

const DealerInsightsPage = () => {
  const { data, isLoading, error, refetch } = useDealerInsights();

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center">Loading insights...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center text-red-500">Error loading insights</div>
      </div>
    );
  }

  const mockTopPerformers = [
    { name: 'Vehicle 1', value: 45000 },
    { name: 'Vehicle 2', value: 38000 },
    { name: 'Vehicle 3', value: 42000 },
  ];

  const mockRecentActivity = [
    { action: 'Valuation', time: '2 hours ago' },
    { action: 'Offer', time: '4 hours ago' },
    { action: 'Report', time: '6 hours ago' },
  ];

  const mockZipCodes = ['90210', '10001', '60601'];

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Dealer Insights</CardTitle>
        </CardHeader>
        <CardContent>
          {data && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold">{data.totalOffers}</div>
                <div className="text-sm text-gray-500">Total Offers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">${data.averageOfferValue.toLocaleString()}</div>
                <div className="text-sm text-gray-500">Average Offer Value</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{Math.round(data.responseRate * 100)}%</div>
                <div className="text-sm text-gray-500">Response Rate</div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Top Performers</h3>
              <div className="space-y-2">
                {mockTopPerformers.map((item: any, index: number) => (
                  <div key={index} className="flex justify-between">
                    <span>{item.name}</span>
                    <span>${item.value.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Recent Activity</h3>
              <div className="space-y-2">
                {mockRecentActivity.map((item: any, index: number) => (
                  <div key={index} className="flex justify-between">
                    <span>{item.action}</span>
                    <span className="text-sm text-gray-500">{item.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3">Market Analysis</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {mockZipCodes.map((zip: string, index: number) => (
                <div key={index} className="border rounded p-3 text-center">
                  <div className="font-semibold">{zip}</div>
                  <div className="text-sm text-gray-500">Active Market</div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DealerInsightsPage;
