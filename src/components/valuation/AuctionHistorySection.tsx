import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { appConfig } from "@/config";

export interface AuctionHistorySectionProps {
  vin: string;
}

interface AuctionRecord {
  vin: string;
  sold_date: string | null;
  price: string | null;
  odometer: string | null;
  auction_source: string;
  photo_urls: string[];
  condition_grade: string | null;
}

export const AuctionHistorySection: React.FC<AuctionHistorySectionProps> = (
  { vin },
) => {
  const [history, setHistory] = useState<AuctionRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          "https://xltxqqzattxogxtqrggt.functions.supabase.co/fetch-auction-history",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization":
                `Bearer ${appConfig.SUPABASE_ANON_KEY}`,
            },
            body: JSON.stringify({ vin }),
          },
        );

        const json = await res.json();
        if (res.status === 200 && json?.data) {
          setHistory(json.data);
        } else {
          setHistory(null);
        }
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [vin]);

  if (loading) {
    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Auction History</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Fetching auction data...
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!history) {
    return null;
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Auction History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p>
            <strong>Source:</strong> {history.auction_source}
          </p>
          <p>
            <strong>Odometer:</strong> {history.odometer || "N/A"}
          </p>
          <p>
            <strong>Price:</strong> {history.price || "N/A"}
          </p>
          <p>
            <strong>Condition:</strong> {history.condition_grade || "Unknown"}
          </p>
          <p>
            <strong>Date Sold:</strong> {history.sold_date || "N/A"}
          </p>
          {history.photo_urls?.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-4">
              {history.photo_urls.map((url, idx) => (
                <img
                  key={idx}
                  src={url}
                  alt={`Auction photo ${idx + 1}`}
                  className="rounded border shadow-sm"
                />
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
