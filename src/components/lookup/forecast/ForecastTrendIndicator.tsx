
import { TrendingUp, TrendingDown, BarChart2 } from 'lucide-react';

interface ForecastTrendIndicatorProps {
  trend: 'increasing' | 'decreasing' | 'stable';
}

export function ForecastTrendIndicator({ trend }: ForecastTrendIndicatorProps) {
  const getTrendColor = () => {
    switch (trend) {
      case 'increasing': return 'text-green-600';
      case 'decreasing': return 'text-red-600';
      default: return 'text-blue-600';
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'increasing': return <TrendingUp className="h-5 w-5 text-green-600" />;
      case 'decreasing': return <TrendingDown className="h-5 w-5 text-red-600" />;
      default: return <BarChart2 className="h-5 w-5 text-blue-600" />;
    }
  };

  return (
    <div className={`flex items-center gap-1 ${getTrendColor()} bg-opacity-10 px-2 py-1 rounded-full`}>
      {getTrendIcon()}
      <span className="text-sm font-medium">
        {trend === 'increasing' ? 'Appreciating' : 
         trend === 'decreasing' ? 'Depreciating' : 'Stable'}
      </span>
    </div>
  );
}
