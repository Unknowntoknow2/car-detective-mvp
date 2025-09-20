
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin } from 'lucide-react';
import { AuctionResult } from '@/types/auction';

interface AuctionResultsProps {
  auctionResults: AuctionResult[];
}

export function AuctionResults({ auctionResults }: AuctionResultsProps) {
  if (!auctionResults || auctionResults.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Auction Results</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">No recent auction results found for this vehicle.</p>
        </CardContent>
      </Card>
    );
  }

  const formatPrice = (price: string | number): string => {
    const numericPrice = typeof price === 'string' ? parseFloat(price.replace(/[^0-9.-]+/g, '')) : price;
    return isNaN(numericPrice) ? 'N/A' : `$${numericPrice.toLocaleString()}`;
  };

  const formatDate = (dateStr: string): string => {
    try {
      return new Date(dateStr).toLocaleDateString();
    } catch {
      return dateStr;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Recent Auction Results</CardTitle>
        <p className="text-sm text-gray-600">
          {auctionResults.length} recent sale{auctionResults.length !== 1 ? 's' : ''} found
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {auctionResults.map((result, index) => (
          <div key={index} className="border rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <h4 className="font-semibold">
                  {result.year} {result.make} {result.model}
                </h4>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Badge variant="outline" className="text-xs">
                    {result.source}
                  </Badge>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDate(result.soldDate)}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-green-600">
                  {formatPrice(typeof result.price === 'string' ? result.price : String(result.price))}
                </p>
                <p className="text-xs text-gray-500">Sale Price</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              {result.mileage && (
                <div>
                  <p className="text-gray-500">Mileage</p>
                  <p className="font-medium">{result.mileage.toLocaleString()} mi</p>
                </div>
              )}
              
              <div>
                <p className="text-gray-500">Condition</p>
                <p className="font-medium">{result.condition || 'N/A'}</p>
              </div>
              
              {result.location && (
                <div>
                  <p className="text-gray-500">Location</p>
                  <p className="font-medium flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {result.location}
                  </p>
                </div>
              )}
            </div>

            {result.photos && result.photos.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Photos</p>
                <div className="flex gap-2 overflow-x-auto">
                  {result.photos.map((url: string, photoIndex: number) => (
                    <img
                      key={photoIndex}
                      src={url}
                      alt={`Auction photo ${photoIndex + 1}`}
                      className="w-16 h-16 object-cover rounded border"
                    />
                  ))}
                </div>
              </div>
            )}

            {result.photos && result.photos.length > 3 && (
              <p className="text-xs text-gray-500">
                +{result.photos.length - 3} more photos
              </p>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
