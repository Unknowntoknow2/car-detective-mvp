import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, ShieldAlert, Gavel, DollarSign, Car } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';

interface AuctionHistorySectionProps {
  vin: string;
}

const AuctionHistorySection = ({ vin }: AuctionHistorySectionProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [auctionData, setAuctionData] = useState<any[]>([]);

  useEffect(() => {
    const fetchAuctionHistory = async () => {
      if (!vin) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        // Check if we already have data in Supabase
        const { data: existingData, error: fetchError } = await supabase
          .from('auction_results_by_vin')
          .select('*')
          .eq('vin', vin)
          .order('sold_date', { ascending: false });
          
        if (fetchError) throw fetchError;
        
        // If we have data, use it
        if (existingData && existingData.length > 0) {
          setAuctionData(existingData);
          setIsLoading(false);
          return;
        }
        
        // Otherwise, fetch from edge function
        const { data, error } = await supabase.functions.invoke('fetch-auction-data', {
          body: { vin }
        });
        
        if (error) throw new Error(error.message);
        
        if (data && data.results) {
          setAuctionData(data.results);
        } else {
          setAuctionData([]);
        }
      } catch (err: any) {
        console.error('Error fetching auction history:', err);
        setError(err.message || 'Failed to load auction history');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAuctionHistory();
  }, [vin]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Auction History</CardTitle>
          <CardDescription>Loading previous auction sales for this VIN</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <ShieldAlert className="h-5 w-5 mr-2 text-destructive" />
            Auction History Unavailable
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            We couldn't retrieve auction history for this vehicle. Please try again later.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (auctionData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Gavel className="h-5 w-5 mr-2 text-primary" />
            Auction History
          </CardTitle>
          <CardDescription>No auction records found</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            We couldn't find any auction records for this VIN. This could mean the vehicle has never been sold at a major auction.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Group by auction source
  const groupedBySource: Record<string, any[]> = {};
  auctionData.forEach(record => {
    const source = record.auction_source || 'unknown';
    if (!groupedBySource[source]) {
      groupedBySource[source] = [];
    }
    groupedBySource[source].push(record);
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <Gavel className="h-5 w-5 mr-2 text-primary" />
          Auction History
        </CardTitle>
        <CardDescription>
          {auctionData.length} record{auctionData.length !== 1 ? 's' : ''} found for this VIN
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={Object.keys(groupedBySource)[0]} className="w-full">
          <TabsList className="grid" style={{ gridTemplateColumns: `repeat(${Object.keys(groupedBySource).length}, 1fr)` }}>
            {Object.keys(groupedBySource).map(source => (
              <TabsTrigger key={source} value={source} className="capitalize">
                {source}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {Object.entries(groupedBySource).map(([source, records]) => (
            <TabsContent key={source} value={source} className="space-y-4 mt-4">
              {records.map((record, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex flex-col md:flex-row justify-between">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-5 w-5 text-green-600" />
                      <span className="text-lg font-semibold">{formatCurrency(parseFloat(record.price))}</span>
                      <Badge variant="outline" className="capitalize">
                        {record.condition_grade || 'Unknown Condition'}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Sold on {new Date(record.sold_date).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <div className="mt-2 flex flex-col sm:flex-row sm:justify-between">
                    <div className="flex items-center space-x-2">
                      <Car className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{record.odometer} miles</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {record.location || 'Location not specified'}
                    </div>
                  </div>
                  
                  {record.photo_urls && record.photo_urls.length > 0 && (
                    <div className="mt-4 grid grid-cols-3 gap-2">
                      {record.photo_urls.slice(0, 3).map((photo: string, photoIndex: number) => (
                        <img 
                          key={photoIndex}
                          src={photo}
                          alt={`Auction photo ${photoIndex + 1}`}
                          className="rounded-md w-full h-24 object-cover"
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AuctionHistorySection;
