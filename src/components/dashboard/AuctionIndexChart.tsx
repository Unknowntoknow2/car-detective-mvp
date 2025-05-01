
import React, { useMemo } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuctionIndex } from '@/hooks/useAuctionIndex';
import { Loader2 } from 'lucide-react';
import { format, subMonths } from 'date-fns';

export const AuctionIndexChart = () => {
  // Get data for the last 12 months
  const today = new Date();
  const twelveMonthsAgo = subMonths(today, 12);
  const startDate = format(twelveMonthsAgo, 'yyyy-MM-dd');
  const endDate = format(today, 'yyyy-MM-dd');
  
  const { data, isLoading, error } = useAuctionIndex(startDate, endDate);
  
  const chartData = useMemo(() => {
    if (!data) return [];
    
    return data.map(entry => ({
      date: format(new Date(entry.date), 'MMM yyyy'),
      overallIndex: entry.index_data.overall_index,
      luxuryIndex: entry.index_data.luxury_index,
      economyIndex: entry.index_data.economy_index,
      suvIndex: entry.index_data.suv_index,
      truckIndex: entry.index_data.truck_index,
    }));
  }, [data]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Auction Price Index Trends</CardTitle>
        </CardHeader>
        <CardContent className="h-80 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
            <p className="text-sm text-gray-500">Loading auction index data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Auction Price Index Trends</CardTitle>
        </CardHeader>
        <CardContent className="h-80 flex items-center justify-center">
          <p className="text-sm text-gray-500">
            {error ? 'Error loading auction data' : 'No auction data available'}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Auction Price Index Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="overallIndex" 
                stroke="#8884d8" 
                name="Overall"
                activeDot={{ r: 8 }} 
              />
              <Line 
                type="monotone" 
                dataKey="luxuryIndex" 
                stroke="#82ca9d" 
                name="Luxury" 
              />
              <Line 
                type="monotone" 
                dataKey="economyIndex" 
                stroke="#ffc658" 
                name="Economy" 
              />
              <Line 
                type="monotone" 
                dataKey="suvIndex" 
                stroke="#ff7300" 
                name="SUV" 
              />
              <Line 
                type="monotone" 
                dataKey="truckIndex" 
                stroke="#0088fe" 
                name="Truck" 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
