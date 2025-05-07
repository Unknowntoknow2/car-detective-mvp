
import React from 'react';
import { motion } from 'framer-motion';
import { CDTable } from '@/components/ui-kit/CDTable';
import ValuationRow, { ValuationRowData } from './ValuationRow';
import styles from '../styles';
import { EmptyStateAnimation } from '@/components/animations/EmptyStateAnimation';
import { FileX } from 'lucide-react';

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const rowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  const renderEmptyState = () => (
    <EmptyStateAnimation
      title="No valuations found"
      description="Try adjusting your filters or adding new valuations."
      icon={<FileX size={40} />}
      ctaText="Refresh Data"
      onCtaClick={onRefresh}
      className="py-12"
    />
  );

  return (
    <motion.div 
      className={styles.tableContainer}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
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
              <motion.tr 
                key={idx} 
                className="animate-pulse"
                variants={rowVariants}
              >
                <td colSpan={columns.length} className="py-4 px-4">
                  <div className="h-6 bg-neutral-lighter rounded w-3/4"></div>
                </td>
              </motion.tr>
            ))
          ) : valuations.length > 0 ? (
            valuations.map((valuation, index) => (
              <motion.tr 
                key={valuation.id}
                variants={rowVariants}
                custom={index}
              >
                <td colSpan={columns.length} className="p-0">
                  <ValuationRow 
                    valuation={valuation}
                    onRefresh={onRefresh}
                  />
                </td>
              </motion.tr>
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
    </motion.div>
  );
};

export default ValuationTable;
