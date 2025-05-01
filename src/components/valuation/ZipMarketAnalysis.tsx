
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DesignCard } from "@/components/ui/design-system";
import { MapPin, TrendingUp, AlertCircle } from "lucide-react";
import { ZipValidation } from "@/components/common/ZipValidation";

interface ZipMarketAnalysisProps {
  zipCode: string;
  setZipCode: (zipCode: string) => void;
  disabled?: boolean;
}

export const ZipMarketAnalysis: React.FC<ZipMarketAnalysisProps> = ({
  zipCode,
  setZipCode,
  disabled = false,
}) => {
  const [marketDemand, setMarketDemand] = useState<"high" | "medium" | "low" | null>(null);
  const [isValidZip, setIsValidZip] = useState(false);
  const [comparableCount, setComparableCount] = useState(0);

  // Validate zip code format
  useEffect(() => {
    const zipRegex = /^\d{5}$/;
    setIsValidZip(zipRegex.test(zipCode));

    if (zipRegex.test(zipCode)) {
      // Simulate fetching market data based on zip code
      // In a real implementation, this would come from an API call
      simulateMarketAnalysis(zipCode);
    } else {
      setMarketDemand(null);
      setComparableCount(0);
    }
  }, [zipCode]);

  // This is a simulation - in a real app, this would be an API call to get market data
  const simulateMarketAnalysis = (zip: string) => {
    // Simulating network delay
    setTimeout(() => {
      // Deterministic "random" based on zip code for demo purposes
      const zipSum = zip.split('').reduce((sum, digit) => sum + parseInt(digit), 0);
      
      if (zipSum % 3 === 0) {
        setMarketDemand("high");
        setComparableCount(75 + (zipSum % 25));
      } else if (zipSum % 3 === 1) {
        setMarketDemand("medium");
        setComparableCount(40 + (zipSum % 30));
      } else {
        setMarketDemand("low");
        setComparableCount(15 + (zipSum % 25));
      }
    }, 500);
  };

  const getMarketImpact = () => {
    if (marketDemand === "high") return "+3.5%";
    if (marketDemand === "medium") return "0%";
    if (marketDemand === "low") return "-2.5%";
    return "Unknown";
  };

  const getMarketColor = () => {
    if (marketDemand === "high") return "text-success";
    if (marketDemand === "medium") return "text-warning";
    if (marketDemand === "low") return "text-error";
    return "text-text-secondary";
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-lg flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          Local Market Analysis
        </h3>
      </div>
      
      <p className="text-sm text-text-secondary">
        Enter your ZIP code to analyze local market conditions and get a more accurate valuation
        based on supply and demand in your area.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-1">
          <div className="space-y-2">
            <Label htmlFor="zip">ZIP Code</Label>
            <Input
              id="zip"
              type="text"
              placeholder="Enter ZIP code"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              maxLength={5}
              className="font-mono"
              disabled={disabled}
            />
            
            {/* Use our new ZipValidation component */}
            {zipCode && zipCode.length === 5 && <ZipValidation zip={zipCode} compact />}
            
            {zipCode && !isValidZip && zipCode.length > 0 && zipCode.length < 5 && (
              <p className="text-xs text-error flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                Please enter a valid 5-digit ZIP code
              </p>
            )}
          </div>
        </div>
        
        <div className="md:col-span-2">
          {marketDemand && isValidZip ? (
            <DesignCard
              variant="outline"
              className="h-full bg-surface-dark/30"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">Market Analysis</h4>
                  <span className="text-xs text-text-secondary flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    Based on {comparableCount} comparable vehicles
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-surface-dark/50 border border-border/50">
                    <div className="text-xs text-text-secondary mb-1">Demand</div>
                    <div className={`font-medium ${getMarketColor()}`}>
                      {marketDemand.charAt(0).toUpperCase() + marketDemand.slice(1)}
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-surface-dark/50 border border-border/50">
                    <div className="text-xs text-text-secondary mb-1">Value Impact</div>
                    <div className={`font-medium ${getMarketColor()}`}>
                      {getMarketImpact()}
                    </div>
                  </div>
                </div>
              </div>
            </DesignCard>
          ) : (
            <div className="h-full flex items-center justify-center border border-dashed border-border rounded-lg p-4">
              <p className="text-sm text-text-secondary">
                Enter a valid ZIP code to see market analysis
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
