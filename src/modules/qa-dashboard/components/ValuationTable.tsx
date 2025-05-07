
import React from 'react';
import { CDTable } from '@/components/ui-kit/CDTable';
import ValuationRow, { ValuationRowData } from './ValuationRow';
import styles from '../styles';

interface ValuationTableProps {
  valuations: ValuationRowData[];
  isLoading: boolean;
  onRefresh: () => void;
}

export const ValuationTable: React.FC<ValuationTableProps> = ({ 
  valuations, 
  isLoading,
  onRefresh
}) => {
  const columns = [
    { header: 'Date', accessor: 'created_at' },
    { header: 'Source', accessor: 'source' },
    { header: 'Vehicle', accessor: 'vehicle' },
    { header: 'Confidence', accessor: 'confidence_score' },
    { header: 'Type', accessor: 'premium_unlocked' },
    { header: 'Valuation', accessor: 'estimated_value' },
    { header: 'Actions', accessor: 'actions' }
  ];

  const renderEmptyState = () => (
    <div className={styles.emptyState}>
      <p className="text-lg font-medium mb-2">No valuations found</p>
      <p className="text-sm text-neutral-dark">Try adjusting your filters or adding new valuations.</p>
    </div>
  );

  return (
    <div className={styles.tableContainer}>
      <table className="min-w-full divide-y divide-neutral-light">
        <thead className="bg-neutral-lighter">
          <tr>
            {columns.map((column) => (
              <th 
                key={column.accessor} 
                className="px-4 py-3 text-left text-xs font-medium text-neutral-dark uppercase tracking-wider"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-neutral-light">
          {isLoading ? (
            Array(5).fill(0).map((_, idx) => (
              <tr key={idx} className="animate-pulse">
                <td colSpan={columns.length} className="py-4 px-4">
                  <div className="h-6 bg-neutral-lighter rounded w-3/4"></div>
                </td>
              </tr>
            ))
          ) : valuations.length > 0 ? (
            valuations.map((valuation) => (
              <ValuationRow 
                key={valuation.id} 
                valuation={valuation}
                onRefresh={onRefresh}
              />
            ))
          ) : (
            <tr>
              <td colSpan={columns.length}>
                {renderEmptyState()}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ValuationTable;
