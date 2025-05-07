
import React from 'react';
import { Valuation } from '../types';
import { ValuationRow } from './ValuationRow';
import { Loader2, AlertCircle, SearchX } from 'lucide-react';
import { motion } from 'framer-motion';

interface ValuationTableProps {
  valuations: Valuation[];
  isLoading: boolean;
  onViewResult: (id: string) => void;
  onRerunGPT: (id: string) => void;
  onGeneratePDF: (id: string) => void;
  onDownloadPDF: (id: string) => void;
  onViewStripeStatus: (id: string) => void;
}

export const ValuationTable: React.FC<ValuationTableProps> = ({
  valuations,
  isLoading,
  onViewResult,
  onRerunGPT,
  onGeneratePDF,
  onDownloadPDF,
  onViewStripeStatus
}) => {
  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
        <span>Loading valuations...</span>
      </div>
    );
  }

  // No valuations state
  if (valuations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <SearchX className="h-16 w-16 text-neutral-lighter mb-4" />
        <h3 className="text-lg font-medium text-neutral-dark">No valuations found</h3>
        <p className="text-neutral-dark mt-1">Try adjusting your filters to see more results</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full table-auto">
        <thead>
          <tr className="bg-neutral-light">
            <th className="py-3 px-4 text-left text-sm font-medium text-neutral-darkest">Date</th>
            <th className="py-3 px-4 text-left text-sm font-medium text-neutral-darkest">Source</th>
            <th className="py-3 px-4 text-left text-sm font-medium text-neutral-darkest">Vehicle</th>
            <th className="py-3 px-4 text-left text-sm font-medium text-neutral-darkest">Condition</th>
            <th className="py-3 px-4 text-left text-sm font-medium text-neutral-darkest">Confidence</th>
            <th className="py-3 px-4 text-left text-sm font-medium text-neutral-darkest">Type</th>
            <th className="py-3 px-4 text-left text-sm font-medium text-neutral-darkest">Value</th>
            <th className="py-3 px-4 text-left text-sm font-medium text-neutral-darkest">Actions</th>
          </tr>
        </thead>
        <tbody>
          {valuations.map((valuation, index) => (
            <motion.tr
              key={valuation.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              style={{ display: 'contents' }}
            >
              <ValuationRow
                valuation={valuation}
                onViewResult={onViewResult}
                onRerunGPT={onRerunGPT}
                onGeneratePDF={onGeneratePDF}
                onDownloadPDF={onDownloadPDF}
                onViewStripeStatus={onViewStripeStatus}
              />
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ValuationTable;
