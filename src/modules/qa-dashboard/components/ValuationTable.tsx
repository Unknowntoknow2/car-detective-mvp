
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ValuationRow } from './ValuationRow';
import { Valuation, ValuationRowProps } from '../types';

interface ValuationTableProps {
  valuations: Valuation[];
  isLoading: boolean;
  onViewResult: (id: string) => void;
  onRerunGPT: (id: string) => void;
  onGeneratePDF: (id: string) => void;
  onDownloadPDF: (id: string) => void;
  onViewStripeStatus: (id: string) => void;
}

export function ValuationTable({
  valuations,
  isLoading,
  onViewResult,
  onRerunGPT,
  onGeneratePDF,
  onDownloadPDF,
  onViewStripeStatus
}: ValuationTableProps) {
  if (isLoading) {
    return <div className="text-center py-4">Loading valuations...</div>;
  }

  if (!valuations || valuations.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No valuations found</p>
      </div>
    );
  }

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[180px]">ID</TableHead>
            <TableHead>Vehicle</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Value</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {valuations.map((valuation) => (
            <ValuationRow
              key={valuation.id}
              valuation={valuation}
              onViewResult={onViewResult}
              onRerunGPT={onRerunGPT}
              onGeneratePDF={onGeneratePDF}
              onDownloadPDF={onDownloadPDF}
              onViewStripeStatus={onViewStripeStatus}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
