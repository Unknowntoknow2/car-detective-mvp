
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatCurrency } from '@/utils/formatters';

interface Listing {
  id: string;
  title: string;
  price: number;
  mileage: number;
  condition: string;
  location: string;
  daysListed: number;
  source: string;
}

interface ComparableListingsTableProps {
  listings: Listing[];
}

export function ComparableListingsTable({ listings }: ComparableListingsTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Vehicle</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Mileage</TableHead>
            <TableHead className="hidden md:table-cell">Condition</TableHead>
            <TableHead className="hidden md:table-cell">Location</TableHead>
            <TableHead className="hidden md:table-cell">Listed</TableHead>
            <TableHead className="hidden md:table-cell">Source</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {listings.map((listing) => (
            <TableRow key={listing.id}>
              <TableCell>{listing.title}</TableCell>
              <TableCell>{formatCurrency(listing.price)}</TableCell>
              <TableCell>{listing.mileage.toLocaleString()}</TableCell>
              <TableCell className="hidden md:table-cell">{listing.condition}</TableCell>
              <TableCell className="hidden md:table-cell">{listing.location}</TableCell>
              <TableCell className="hidden md:table-cell">{listing.daysListed} days</TableCell>
              <TableCell className="hidden md:table-cell">{listing.source}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
