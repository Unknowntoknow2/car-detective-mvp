
import React, { useState, useEffect } from 'react';
import { getAuctionResultsByVin, triggerAuctionDataFetch } from '@/utils/auctionFetcher';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Skeleton } from '@/components/ui/skeleton';
import { Clock, DollarSign, MapPin, Car } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface AuctionHistorySectionProps {
  vin: string;
}

const AuctionHistorySection: React.FC<AuctionHistorySectionProps> = ({ vin }) => {
  const [auctionResults, setAuctionResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAuctionData = async () => {
      if (!vin) return;
      
      setLoading(true);
      setError(null);
      
      try {
        // Trigger background fetch of auction data
        await triggerAuctionDataFetch(vin);
        
        // Fetch any existing auction data
        const results = await getAuctionResultsByVin(vin);
        setAuctionResults(results);
      } catch (err) {
        console.error('Error fetching auction data:', err);
        setError('Failed to fetch auction history');
      } finally {
        setLoading(false);
      }
    };

    if (vin) {
      fetchAuctionData();
    }
  }, [vin]);

  // Function to format price
  const formatPrice = (priceStr: string) => {
    const price = parseFloat(priceStr.replace(/[^0-9.]/g, ''));
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(price);
  };

  // Function to format date
  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (e) {
      return dateStr;
    }
  };

  // Function to format odometer reading
  const formatOdometer = (odometerStr: string) => {
    const miles = parseInt(odometerStr.replace(/[^0-9]/g, ''));
    return new Intl.NumberFormat('en-US').format(miles) + ' mi';
  };

  if (loading) {
    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Auction History</CardTitle>
          <CardDescription>Loading auction records for this vehicle...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden">
                <div className="relative">
                  <Skeleton className="h-40 w-full" />
                </div>
                <CardContent className="p-4">
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-6 w-36 mb-4" />
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Auction History</CardTitle>
          <CardDescription>Error loading auction records</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (auctionResults.length === 0) {
    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Auction History</CardTitle>
          <CardDescription>No auction records found for this vehicle</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Car className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Auction Records Found</h3>
            <p className="text-muted-foreground">
              We couldn't find any auction records for this VIN in our database.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Auction History</CardTitle>
        <CardDescription>
          {auctionResults.length} auction records found for this vehicle
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {auctionResults.map((result) => (
            <Card key={result.id} className="overflow-hidden">
              <div className="relative">
                {result.photo_urls && result.photo_urls.length > 0 ? (
                  <AspectRatio ratio={16 / 9}>
                    <img
                      src={result.photo_urls[0]}
                      alt="Vehicle at auction"
                      className="object-cover w-full h-full"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/car-placeholder.png';
                      }}
                    />
                  </AspectRatio>
                ) : (
                  <AspectRatio ratio={16 / 9}>
                    <div className="flex items-center justify-center w-full h-full bg-gray-100">
                      <Car className="h-12 w-12 text-gray-400" />
                    </div>
                  </AspectRatio>
                )}
                <Badge 
                  className="absolute top-2 right-2 bg-primary"
                  variant="secondary"
                >
                  {result.auction_source}
                </Badge>
              </div>
              <CardContent className="p-4">
                <div className="mb-2 flex justify-between items-center">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{formatDate(result.sold_date)}</span>
                  </div>
                  {result.condition_grade && (
                    <Badge variant="outline">
                      Grade: {result.condition_grade}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center mb-4">
                  <DollarSign className="h-5 w-5 text-primary mr-1" />
                  <span className="text-2xl font-bold">
                    {formatPrice(result.price)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {formatOdometer(result.odometer)}
                  </span>
                  {result.location && (
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="h-3 w-3 mr-1" />
                      <span>{result.location}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AuctionHistorySection;
