
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';

export interface ComparableListing {
  title: string;
  price: number;
  source: string;
  mileage?: number;
  url?: string;
  distance?: number;
  id?: string;
  condition?: string;
  location?: string;
  daysListed?: number;
}

interface ComparableListingsTableProps {
  listings: ComparableListing[];
}

export function ComparableListingsTable({ listings }: ComparableListingsTableProps) {
  if (!listings || listings.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          No comparable listings found for this vehicle.
        </p>
      </div>
    );
  }
  
  return (
    <div>
      <h3 className="font-medium mb-4">Most Similar Vehicles</h3>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Vehicle</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Mileage</TableHead>
              <TableHead className="text-right">View</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {listings.map((listing, index) => (
              <TableRow key={listing.id || index}>
                <TableCell className="font-medium">{listing.title}</TableCell>
                <TableCell>{formatCurrency(listing.price)}</TableCell>
                <TableCell>
                  <span className="capitalize">{listing.source}</span>
                </TableCell>
                <TableCell>
                  {listing.mileage ? `${listing.mileage.toLocaleString()} mi` : 'Unknown'}
                </TableCell>
                <TableCell className="text-right">
                  {listing.url ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(listing.url, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  ) : (
                    <span className="text-muted-foreground text-xs">N/A</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
