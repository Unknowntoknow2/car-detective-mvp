
import React, { useEffect, useState } from "react";
import { fetchAuctionResultsByVin } from "@/services/auction";
import { AuctionResult } from "@/types/auction";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface AuctionResultsProps {
  vin: string;
}

export function AuctionResults({ vin }: AuctionResultsProps) {
  const [results, setResults] = useState<AuctionResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!vin) {
      setLoading(false);
      return;
    }

    fetchAuctionResultsByVin(vin).then((data) => {
      setResults(data);
      setLoading(false);
    });
  }, [vin]);

  if (loading) {
    return (
      <Card className="mt-6">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <span className="ml-2">Loading auction results...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (results.length === 0) {
    return (
      <Card className="mt-6">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-2">Auction History</h3>
          <p className="text-muted-foreground">No auction history found for this VIN.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-6">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Auction History</h3>
        <div className="space-y-4">
          {results.map((item, index) => (
            <div key={`${item.vin}-${index}`} className="bg-gray-50 p-4 rounded-lg border">
              <div className="flex justify-between items-start mb-3">
                <Badge variant="outline" className="uppercase">
                  {item.auction_source}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {new Date(item.sold_date).toLocaleDateString()}
                </span>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Sold Price:</span>
                  <div className="text-lg font-semibold text-green-600">
                    ${parseInt(item.price || '0').toLocaleString()}
                  </div>
                </div>
                
                {item.odometer && (
                  <div>
                    <span className="font-medium text-gray-700">Mileage:</span>
                    <div>{parseInt(item.odometer).toLocaleString()} mi</div>
                  </div>
                )}
                
                {item.condition_grade && (
                  <div>
                    <span className="font-medium text-gray-700">Condition:</span>
                    <div>{item.condition_grade}</div>
                  </div>
                )}
                
                {item.location && (
                  <div>
                    <span className="font-medium text-gray-700">Location:</span>
                    <div className="text-xs">{item.location}</div>
                  </div>
                )}
              </div>

              {item.photo_urls && item.photo_urls.length > 0 && (
                <div className="mt-3 flex space-x-2 overflow-x-auto">
                  {item.photo_urls.slice(0, 3).map((url, photoIndex) => (
                    <img
                      key={photoIndex}
                      src={url}
                      alt={`Auction photo ${photoIndex + 1}`}
                      className="w-16 h-16 object-cover rounded border flex-shrink-0"
                      loading="lazy"
                    />
                  ))}
                  {item.photo_urls.length > 3 && (
                    <div className="w-16 h-16 bg-gray-200 rounded border flex items-center justify-center flex-shrink-0">
                      <span className="text-xs text-gray-600">
                        +{item.photo_urls.length - 3}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default AuctionResults;
