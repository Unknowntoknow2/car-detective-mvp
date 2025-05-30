
import React from 'react';
import { useUserRole } from '@/hooks/useUserRole';
import { AuctionResult } from '@/types/auction';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

type Props = {
  results: AuctionResult[];
  ainSummary?: string;
};

export const AuctionInsightCard: React.FC<Props> = ({ results, ainSummary }) => {
  const { isPremium, isDealer, isLoading } = useUserRole();

  // Don't render anything while loading user role
  if (isLoading) {
    return null;
  }

  // Show premium gate for non-premium users
  if (!isPremium && !isDealer) {
    return (
      <Card className="mt-6">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-2">Auction History</h3>
          <p className="text-sm text-muted-foreground">
            Upgrade to Premium to unlock auction history and dealer flip risk scores.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Don't render if no auction results
  if (!results?.length) {
    return null;
  }

  return (
    <Card className="mt-6 border-blue-200 shadow-md">
      <CardContent className="p-6 space-y-4">
        <div>
          <h3 className="text-xl font-semibold mb-2">Auction History</h3>
          <p className="text-sm text-muted-foreground">
            Past appearances in Copart, IAAI, and other auction sites for this VIN.
          </p>
        </div>

        <div className="space-y-3">
          {results.map((auction, idx) => (
            <div key={`${auction.vin}-${idx}`} className="bg-gray-50 p-4 rounded-lg shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium uppercase text-gray-700">
                  {auction.auction_source}
                </span>
                <Badge variant="outline">{auction.sold_date}</Badge>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-muted-foreground mb-3">
                <div>
                  <span className="font-medium">Price:</span> ${parseFloat(auction.price || '0').toLocaleString()}
                </div>
                {auction.odometer && (
                  <div>
                    <span className="font-medium">Mileage:</span> {parseInt(auction.odometer).toLocaleString()} mi
                  </div>
                )}
                {auction.location && (
                  <div>
                    <span className="font-medium">Location:</span> {auction.location}
                  </div>
                )}
                {auction.condition_grade && (
                  <div>
                    <span className="font-medium">Condition:</span> {auction.condition_grade}
                  </div>
                )}
              </div>

              {auction.photo_urls && auction.photo_urls.length > 0 && (
                <div className="flex space-x-2 overflow-x-auto">
                  {auction.photo_urls.slice(0, 4).map((url, index) => (
                    <img
                      key={index}
                      src={url}
                      alt={`Auction photo ${index + 1}`}
                      className="w-20 h-20 object-cover rounded border flex-shrink-0"
                      loading="lazy"
                    />
                  ))}
                  {auction.photo_urls.length > 4 && (
                    <div className="w-20 h-20 bg-gray-200 rounded border flex items-center justify-center flex-shrink-0">
                      <span className="text-xs text-gray-600">
                        +{auction.photo_urls.length - 4}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {ainSummary && (
          <>
            <Separator />
            <div className="text-sm text-blue-900 bg-blue-50 p-4 rounded-lg">
              <strong className="block mb-2">AI Analysis:</strong>
              <p>{ainSummary}</p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
