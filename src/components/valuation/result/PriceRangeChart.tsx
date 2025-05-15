import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/utils/formatters';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface PriceRangeChartProps {
  estimatedValue: number;
  priceRange?: [number, number];
  marketAverage?: number;
  className?: string;
}

const PriceRangeChart: React.FC<PriceRangeChartProps> = ({
  estimatedValue,
  priceRange = [
    Math.floor(estimatedValue * 0.9),
    Math.ceil(estimatedValue * 1.1),
  ],
  marketAverage = estimatedValue * 0.98,
  className,
}) => {
  // Calculate the midpoint for better visualization
  const midpoint = (priceRange[0] + priceRange[1]) / 2;
  
  // Create data for the chart
  const data = {
    labels: ['Price Range'],
    datasets: [
      {
        label: 'Price Range',
        data: [{ y: 0, x: 'Price Range', low: priceRange[0], high: priceRange[1] }],
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        borderColor: 'rgba(53, 162, 235, 1)',
        borderWidth: 1,
        borderRadius: 4,
        barThickness: 60,
      },
      {
        label: 'Estimated Value',
        data: [estimatedValue],
        backgroundColor: 'rgba(255, 99, 132, 0.8)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 2,
        borderRadius: 4,
        barThickness: 10,
        type: 'bar' as const,
      },
      {
        label: 'Market Average',
        data: [marketAverage],
        backgroundColor: 'rgba(75, 192, 192, 0.8)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
        borderRadius: 4,
        barThickness: 10,
        type: 'bar' as const,
      },
    ],
  };

  // Chart options
  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: false,
        min: Math.floor(priceRange[0] * 0.95),
        max: Math.ceil(priceRange[1] * 1.05),
        ticks: {
          callback: (value: number) => formatCurrency(value),
        },
      },
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            if (context.dataset.label === 'Price Range') {
              return [
                `Low: ${formatCurrency(context.raw.low)}`,
                `High: ${formatCurrency(context.raw.high)}`,
              ];
            }
            return `${context.dataset.label}: ${formatCurrency(context.raw)}`;
          },
        },
      },
    },
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">Price Range</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <Bar data={data} options={options} />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Price Range</p>
            <p className="font-medium">
              {formatCurrency(priceRange[0])} - {formatCurrency(priceRange[1])}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Estimated Value</p>
            <p className="font-medium">{formatCurrency(estimatedValue)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PriceRangeChart;
