
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Car } from "lucide-react";
import { fetchAuctionHistory, AuctionData } from "@/services/auctionDataService";

interface AuctionHistorySectionProps {
  vin: string;
}

export function AuctionHistorySection({ vin }: AuctionHistorySectionProps) {
  const [auctionData, setAuctionData] = useState<AuctionData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAuctionHistory = async () => {
      if (!vin) return;
      
      setIsLoading(true);
      try {
        const data = await fetchAuctionHistory(vin);
        setAuctionData(data);
      } catch (error) {
        console.error('Failed to load auction history:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAuctionHistory();
  }, [vin]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Auction History</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Loading auction history...</p>
        </CardContent>
      </Card>
    );
  }

  if (auctionData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Auction History</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No auction history found for this vehicle.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Auction History ({auctionData.length} records)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {auctionData.map((auction) => (
            <div key={auction.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold text-lg">${auction.salePrice.toLocaleString()}</h3>
                  <Badge variant="secondary">{auction.source}</Badge>
                </div>
                <div className="text-right text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(auction.saleDate).toLocaleDateString()}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Car className="h-4 w-4" />
                  {auction.mileage.toLocaleString()} miles
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {auction.location}
                </div>
              </div>
              
              <div className="mt-2">
                <span className="text-sm text-muted-foreground">Condition: </span>
                <Badge variant="outline">{auction.condition}</Badge>
              </div>
              
              {auction.images.length > 0 && (
                <div className="mt-3">
                  <div className="flex gap-2 overflow-x-auto">
                    {auction.images.slice(0, 3).map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`Auction photo ${index + 1}`}
                        className="w-20 h-20 object-cover rounded"
                      />
                    ))}
                    {auction.images.length > 3 && (
                      <div className="w-20 h-20 bg-gray-100 rounded flex items-center justify-center text-sm">
                        +{auction.images.length - 3}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
