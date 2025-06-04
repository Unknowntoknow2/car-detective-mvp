// src/components/valuation/AuctionHistoryViewer.tsx

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface AuctionData {
  vin: string;
  sold_date: string;
  price: string;
  odometer: string;
  condition_grade?: string;
  location?: string;
  auction_source: string;
  photo_urls: string[];
}

interface Props {
  data: AuctionData;
}

export const AuctionHistoryViewer: React.FC<Props> = ({ data }) => {
  if (!data) return null;

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>📊 Auction History Found</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-2">
          <strong>Sold Date:</strong> {data.sold_date} <br />
          <strong>Final Price:</strong> {data.price} <br />
          <strong>Odometer:</strong> {data.odometer} <br />
          <strong>Condition:</strong> {data.condition_grade || "N/A"} <br />
          <strong>Auction:</strong> {data.auction_source}{" "}
          ({data.location || "Unknown"})
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mt-4">
          {data.photo_urls?.slice(0, 12).map((url, idx) => (
            <img
              key={idx}
              src={url}
              alt={`Auction ${idx}`}
              className="rounded border w-full h-32 object-cover"
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
