
import React, { useEffect, useState } from 'react';
import { fetchBidCarsByVin } from '@/utils/auctionFetcher';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar, Gauge, MapPin, Tag } from 'lucide-react';

interface BidCarsRecord {
  vin: string;
  price: string;
  odometer: string;
  year?: string;
  make?: string;
  model?: string;
  condition?: string;
  auction_date?: string;
  image?: string;
  source: string;
}

interface BidCarsResultsProps {
  vin: string;
}

export function BidCarsResults({ vin }: BidCarsResultsProps) {
  const [records, setRecords] = useState<BidCarsRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!vin) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const data = await fetchBidCarsByVin(vin);
        setRecords(data);
      } catch (err) {
        setError('Failed to load auction data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [vin]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            Bid.Cars Auction History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            Bid.Cars Auction History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-4">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Tag className="h-5 w-5" />
          Bid.Cars Auction History
        </CardTitle>
        {records.length > 0 && (
          <p className="text-sm text-muted-foreground">
            Found {records.length} auction record{records.length !== 1 ? 's' : ''} for this VIN
          </p>
        )}
      </CardHeader>
      <CardContent>
        {records.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">
            No auction records found for this vehicle.
          </p>
        ) : (
          <div className="space-y-4">
            {records.map((record, idx) => (
              <div key={idx} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    {(record.year || record.make || record.model) && (
                      <h4 className="font-medium">
                        {[record.year, record.make, record.model].filter(Boolean).join(' ')}
                      </h4>
                    )}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      {record.price && (
                        <div className="flex items-center gap-1">
                          <span className="font-medium">Price:</span>
                          <span>${parseFloat(record.price || '0').toLocaleString()}</span>
                        </div>
                      )}
                      {record.odometer && (
                        <div className="flex items-center gap-1">
                          <Gauge className="h-3 w-3" />
                          <span>{parseInt(record.odometer).toLocaleString()} mi</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {record.image && (
                    <img
                      src={record.image}
                      alt="Vehicle"
                      className="w-24 h-18 object-cover rounded border"
                      loading="lazy"
                    />
                  )}
                </div>

                <div className="flex flex-wrap gap-2 text-xs">
                  {record.condition && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Tag className="h-3 w-3" />
                      {record.condition}
                    </Badge>
                  )}
                  {record.auction_date && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(record.auction_date).toLocaleDateString()}
                    </Badge>
                  )}
                  <Badge variant="secondary">Bid.Cars</Badge>
                </div>

                {idx < records.length - 1 && <Separator className="mt-4" />}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
