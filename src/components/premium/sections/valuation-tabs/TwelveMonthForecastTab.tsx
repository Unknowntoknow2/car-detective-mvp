
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { TabContentWrapper } from "./TabContentWrapper";
import { useAuth } from "@/contexts/AuthContext";
import { useForecastData } from "./forecast/useForecastData";
import { ForecastChart } from "./forecast/ForecastChart";
import { ForecastSummary } from "./forecast/ForecastSummary";
import { ForecastError } from "./forecast/ForecastError";

interface TwelveMonthForecastTabProps {
  vehicleData?: {
    make: string;
    model: string;
    year: number;
    trim?: string;
    vin?: string;
  };
  valuationId?: string;
  estimatedValue?: number;
}

export function TwelveMonthForecastTab({ 
  vehicleData, 
  valuationId = "mock-id", 
  estimatedValue = 25000 
}: TwelveMonthForecastTabProps) {
  const { user } = useAuth();
  const { forecastData, isLoading, error } = useForecastData(valuationId);
  
  if (!user) {
    return (
      <TabContentWrapper
        title="12-Month Value Forecast"
        description="Forecast your vehicle's future value based on market trends and historical data"
      >
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 text-center">
          <Calendar className="h-12 w-12 text-amber-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-amber-800 mb-2">Authentication Required</h3>
          <p className="text-amber-700 mb-4">
            You need to be logged in to view forecasting data.
          </p>
          <Button asChild className="bg-amber-600 hover:bg-amber-700 text-white">
            <a href="/auth">Sign In / Register</a>
          </Button>
        </div>
      </TabContentWrapper>
    );
  }
  
  if (!vehicleData) {
    return (
      <TabContentWrapper
        title="12-Month Value Forecast"
        description="Forecast your vehicle's future value based on market trends and historical data"
      >
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 text-center">
          <Calendar className="h-12 w-12 text-amber-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-amber-800 mb-2">Vehicle Information Required</h3>
          <p className="text-amber-700 mb-4">
            Please first look up a vehicle using VIN, license plate, or manual entry
            to generate a 12-month forecast.
          </p>
        </div>
      </TabContentWrapper>
    );
  }
  
  const chartData = forecastData?.months.map((month, index) => ({
    month,
    value: forecastData.values[index]
  })) || [];

  return (
    <TabContentWrapper
      title="12-Month Value Forecast"
      description={`Value forecast for ${vehicleData.year} ${vehicleData.make} ${vehicleData.model} ${vehicleData.trim || ""}`}
    >
      <div className="space-y-6">
        {error ? (
          <ForecastError 
            error={error} 
            onRetry={() => window.location.reload()} 
          />
        ) : (
          <>
            <ForecastChart 
              data={chartData}
              isLoading={isLoading}
              basePrice={estimatedValue}
            />
            
            {forecastData && (
              <ForecastSummary
                trend={forecastData.trend}
                percentageChange={forecastData.percentageChange}
                confidenceScore={forecastData.confidenceScore}
                bestTimeToSell={forecastData.bestTimeToSell}
              />
            )}
            
            <div className="flex justify-end">
              <Button className="bg-primary">
                Download Forecast Report
              </Button>
            </div>
          </>
        )}
      </div>
    </TabContentWrapper>
  );
}
