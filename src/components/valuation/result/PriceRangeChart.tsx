
import React from 'react';
import { Line } from 'react-chartjs-2';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/utils/formatters';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface PriceRangeChartProps {
  currentValue: number;
  historicalPrices?: {
    date: string;
    price: number;
  }[];
  forecast?: {
    date: string;
    price: number;
    isEstimate: boolean;
  }[];
  isPremium?: boolean;
}

export const PriceRangeChart: React.FC<PriceRangeChartProps> = ({
  currentValue,
  historicalPrices = [],
  forecast = [],
  isPremium = false
}) => {
  // Generate sample data if not provided or if not premium
  const generateSampleData = () => {
    const currentDate = new Date();
    const result = [];
    
    // Historical prices (last 12 months)
    for (let i = 11; i >= 0; i--) {
      const date = new Date(currentDate);
      date.setMonth(currentDate.getMonth() - i);
      const month = date.toLocaleString('default', { month: 'short' });
      const year = date.getFullYear().toString().slice(2);
      
      const randomFactor = 0.95 + (Math.random() * 0.1); // Between 0.95 and 1.05
      const price = Math.round(currentValue * randomFactor);
      
      result.push({
        date: `${month} '${year}`,
        price,
        isEstimate: false
      });
    }
    
    // Current month (actual value)
    const currentMonth = currentDate.toLocaleString('default', { month: 'short' });
    const currentYear = currentDate.getFullYear().toString().slice(2);
    result.push({
      date: `${currentMonth} '${currentYear}`,
      price: currentValue,
      isEstimate: false
    });
    
    if (isPremium) {
      // Future forecast (next 6 months)
      for (let i = 1; i <= 6; i++) {
        const date = new Date(currentDate);
        date.setMonth(currentDate.getMonth() + i);
        const month = date.toLocaleString('default', { month: 'short' });
        const year = date.getFullYear().toString().slice(2);
        
        // Simulating a trend (slight decrease)
        const randomFactor = 0.99 - (i * 0.005) + (Math.random() * 0.02);
        const price = Math.round(currentValue * randomFactor);
        
        result.push({
          date: `${month} '${year}`,
          price,
          isEstimate: true
        });
      }
    }
    
    return result;
  };
  
  // Use provided data or generate sample data
  const combinedData = historicalPrices.length > 0 || forecast.length > 0
    ? [...historicalPrices.map(item => ({ ...item, isEstimate: false })), ...forecast]
    : generateSampleData();
  
  // Separate actual values and estimates for the chart
  const labels = combinedData.map(item => item.date);
  const actualValues = combinedData
    .map(item => item.isEstimate ? null : item.price);
  const estimatedValues = combinedData
    .map(item => item.isEstimate ? item.price : null);
  
  const data = {
    labels,
    datasets: [
      {
        label: 'Actual Value',
        data: actualValues,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        pointBorderColor: 'rgb(59, 130, 246)',
        pointBackgroundColor: '#fff',
        tension: 0.3,
        fill: false
      },
      {
        label: 'Estimated Value',
        data: estimatedValues,
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.3)',
        pointBorderColor: 'rgb(99, 102, 241)',
        pointBackgroundColor: '#fff',
        borderDash: [5, 5],
        tension: 0.3,
        fill: false
      }
    ]
  };
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          boxWidth: 6
        }
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += formatCurrency(context.parsed.y);
            }
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        ticks: {
          callback: function(value: any) {
            return formatCurrency(value);
          }
        }
      }
    }
  };
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-muted/20">
        <CardTitle className="text-lg">Price Trend</CardTitle>
      </CardHeader>
      <CardContent className="py-4">
        <div className="h-64">
          <Line data={data} options={options} />
        </div>
        
        {!isPremium && (
          <div className="mt-4 p-4 bg-muted/30 rounded-md text-center text-sm">
            <p className="text-muted-foreground">
              Upgrade to Premium to see projected value forecast for the next 6 months
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PriceRangeChart;
