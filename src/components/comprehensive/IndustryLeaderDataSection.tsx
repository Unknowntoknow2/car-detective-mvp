
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { fetchIndustryLeaderData } from "@/services/auctionDataService";

interface IndustryLeaderDataSectionProps {
  vin: string;
  make: string;
  model: string;
  year: string;
  estimatedValue?: number;
}

export function IndustryLeaderDataSection({ 
  vin, 
  make, 
  model, 
  year, 
  estimatedValue = 0 
}: IndustryLeaderDataSectionProps) {
  const [industryData, setIndustryData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadIndustryData = async () => {
      if (!vin || !make || !model || !year) return;
      
      setIsLoading(true);
      try {
        const data = await fetchIndustryLeaderData(vin, make, model, year);
        setIndustryData(data);
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    };

    loadIndustryData();
  }, [vin, make, model, year]);

  const getComparisonIcon = (value: number) => {
    const diff = value - estimatedValue;
    const percentage = (diff / estimatedValue) * 100;
    
    if (percentage > 5) return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (percentage < -5) return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <Minus className="h-4 w-4 text-gray-500" />;
  };

  const formatPrice = (price: string | null) => {
    if (!price || price === '0') return 'N/A';
    const numPrice = parseInt(price.replace(/[^0-9]/g, ''));
    return `$${numPrice.toLocaleString()}`;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Industry Leader Pricing</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Loading industry pricing data...</p>
        </CardContent>
      </Card>
    );
  }

  if (!industryData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Industry Leader Pricing</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No industry pricing data available.</p>
        </CardContent>
      </Card>
    );
  }

  const industryLeaders = [
    { name: 'Carvana', value: industryData.carvana, color: 'bg-blue-100 text-blue-800' },
    { name: 'CarMax', value: industryData.carmax, color: 'bg-red-100 text-red-800' },
    { name: 'Edmunds', value: industryData.edmunds, color: 'bg-green-100 text-green-800' },
    { name: 'Carfax', value: industryData.carfax, color: 'bg-purple-100 text-purple-800' },
    { name: 'Cars.com', value: industryData.carsDotCom, color: 'bg-orange-100 text-orange-800' },
    { name: 'AutoTrader', value: industryData.autotrader, color: 'bg-indigo-100 text-indigo-800' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Industry Leader Pricing</CardTitle>
        <p className="text-sm text-muted-foreground">
          Compare with major automotive platforms
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {industryLeaders.map((leader) => {
            const price = formatPrice(leader.value);
            const numPrice = parseInt((leader.value || '0').replace(/[^0-9]/g, ''));
            
            return (
              <div key={leader.name} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Badge className={leader.color}>
                    {leader.name}
                  </Badge>
                  {price !== 'N/A' && estimatedValue > 0 && getComparisonIcon(numPrice)}
                </div>
                <span className="font-semibold">
                  {price}
                </span>
              </div>
            );
          })}
        </div>
        
        {industryData.fetchedAt && (
          <p className="text-xs text-muted-foreground mt-4">
            Last updated: {new Date(industryData.fetchedAt).toLocaleString()}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
