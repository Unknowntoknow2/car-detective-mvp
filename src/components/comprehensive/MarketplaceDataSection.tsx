
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, RefreshCw } from "lucide-react";
import { fetchMarketplaceListings } from "@/services/auctionDataService";

interface MarketplaceDataSectionProps {
  make: string;
  model: string;
  year: number;
  zipCode: string;
}

export function MarketplaceDataSection({ make, model, year, zipCode }: MarketplaceDataSectionProps) {
  const [marketplaceData, setMarketplaceData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadMarketplaceData = async () => {
    if (!make || !model || !year || !zipCode) return;
    
    setIsLoading(true);
    try {
      const data = await fetchMarketplaceListings(make, model, year, zipCode);
      setMarketplaceData(data);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMarketplaceData();
  }, [make, model, year, zipCode]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Live Marketplace Data</CardTitle>
        <Button variant="outline" size="sm" onClick={loadMarketplaceData} disabled={isLoading}>
          <RefreshCw className="h-4 w-4 mr-2" />
          {isLoading ? "Scanning..." : "Refresh"}
        </Button>
      </CardHeader>
      <CardContent>
        {marketplaceData.length === 0 ? (
          <p className="text-muted-foreground">
            Click refresh to scan marketplaces for {year} {make} {model} in {zipCode}
          </p>
        ) : (
          <div className="space-y-3">
            {marketplaceData.map((platform, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="capitalize">
                    {platform.platform}
                  </Badge>
                  <span className="text-sm">
                    {platform.count} listings found
                  </span>
                </div>
                <Button variant="ghost" size="sm">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            ))}
            
            <div className="mt-4 p-3 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                💡 Marketplace data includes listings from Craigslist, Facebook Marketplace, eBay Motors, and OfferUp
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
