
interface ForecastMetricsProps {
  bestTimeToSell: string;
  percentageChange: number;
  lowestValue: number;
  highestValue: number;
}

export function ForecastMetrics({ 
  bestTimeToSell, 
  percentageChange, 
  lowestValue, 
  highestValue 
}: ForecastMetricsProps) {
  return (
    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
      <div className="p-4 bg-primary/5 rounded-lg">
        <p className="font-medium">Best Time to Sell</p>
        <p className="text-lg">{bestTimeToSell}</p>
      </div>
      <div className="p-4 bg-primary/5 rounded-lg">
        <p className="font-medium">12-Month Change</p>
        <p className={`text-lg ${percentageChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {percentageChange}%
        </p>
      </div>
      <div className="p-4 bg-primary/5 rounded-lg">
        <p className="font-medium">Value Range</p>
        <p className="text-lg">
          ${lowestValue.toLocaleString()} - ${highestValue.toLocaleString()}
        </p>
      </div>
    </div>
  );
}
