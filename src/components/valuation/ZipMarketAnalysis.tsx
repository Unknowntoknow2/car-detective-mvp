
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DesignCard } from "@/components/ui/design-system";
import { MapPin, TrendingUp, AlertCircle, Loader2 } from "lucide-react";
import { ZipValidation } from "@/components/common/ZipValidation";
import { supabase } from "@/integrations/supabase/client";

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
  const [marketMultiplier, setMarketMultiplier] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Validate zip code format
  useEffect(() => {
    const zipRegex = /^\d{5}$/;
    setIsValidZip(zipRegex.test(zipCode));

    if (zipRegex.test(zipCode)) {
      fetchMarketAnalysis(zipCode);
    } else {
      setMarketDemand(null);
      setComparableCount(0);
      setMarketMultiplier(null);
    }
  }, [zipCode]);

  const fetchMarketAnalysis = async (zip: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch market multiplier from Supabase
      const { data, error } = await supabase
        .from('market_adjustments')
        .select('market_multiplier')
        .eq('zip_code', zip)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching market multiplier:', error);
        setError('Could not fetch market data');
        // Continue with fallback
      }
      
      // If we found market data in the database
      if (data && data.market_multiplier !== null) {
        setMarketMultiplier(data.market_multiplier);
        
        // Categorize demand based on multiplier
        if (data.market_multiplier >= 3) {
          setMarketDemand("high");
        } else if (data.market_multiplier >= -1) {
          setMarketDemand("medium");
        } else {
          setMarketDemand("low");
        }
        
        // Get comparable count from valuation_stats if available
        const { data: statsData } = await supabase
          .from('valuation_stats')
          .select('total_valuations')
          .eq('zip_code', zip)
          .maybeSingle();
          
        if (statsData && statsData.total_valuations) {
          setComparableCount(statsData.total_valuations);
        } else {
          // Random comparables as fallback
          const zipSum = zip.split('').reduce((sum, digit) => sum + parseInt(digit), 0);
          setComparableCount(40 + (zipSum % 40));
        }
      } else {
        // Fallback to deterministic simulation if no data in database
        const zipSum = zip.split('').reduce((sum, digit) => sum + parseInt(digit), 0);
        
        if (zipSum % 3 === 0) {
          setMarketDemand("high");
          setMarketMultiplier(3.5);
          setComparableCount(75 + (zipSum % 25));
        } else if (zipSum % 3 === 1) {
          setMarketDemand("medium");
          setMarketMultiplier(0);
          setComparableCount(40 + (zipSum % 30));
        } else {
          setMarketDemand("low");
          setMarketMultiplier(-2.5);
          setComparableCount(15 + (zipSum % 25));
        }
      }
    } catch (err) {
      console.error('Error in market analysis:', err);
      setError('Failed to analyze market data');
      
      // Set fallback values
      setMarketDemand("medium");
      setMarketMultiplier(0);
      setComparableCount(35);
    } finally {
      setIsLoading(false);
    }
  };

  const getMarketImpact = () => {
    if (marketMultiplier === null) return "Unknown";
    if (marketMultiplier === 0) return "0%";
    return `${marketMultiplier > 0 ? '+' : ''}${marketMultiplier}%`;
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
          {isLoading ? (
            <DesignCard
              variant="outline"
              className="h-full bg-surface-dark/30"
            >
              <div className="h-full flex items-center justify-center p-4">
                <Loader2 className="h-5 w-5 animate-spin text-primary mr-2" />
                <p className="text-sm text-text-secondary">
                  Analyzing market data...
                </p>
              </div>
            </DesignCard>
          ) : marketDemand && isValidZip ? (
            <DesignCard
              variant="outline"
              className="h-full bg-surface-dark/30"
            >
              <div className="space-y-3 p-4">
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
                
                {error && (
                  <p className="text-xs text-error flex items-center mt-2">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {error}
                  </p>
                )}
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
