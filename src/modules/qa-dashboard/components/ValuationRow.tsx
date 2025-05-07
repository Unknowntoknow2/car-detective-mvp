import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Eye, Edit, Download, Trash2 } from 'lucide-react';
import { CDButton } from '@/components/ui-kit/CDButton';
import { ValuationResultProps } from '@/types/valuation-result';
import { useAuth } from '@/contexts/AuthContext';

interface ValuationRowProps {
  valuation: ValuationResultProps;
  onEdit: (valuation: ValuationResultProps) => void;
  onDelete: (valuationId: string | undefined) => void;
}

export const ValuationRow: React.FC<ValuationRowProps> = ({ valuation, onEdit, onDelete }) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { user } = useAuth();
  const isQAUser = user?.email === 'qa@example.com';

  const handleViewDetails = () => {
    // Implement view details logic
    console.log('View details clicked', valuation.valuationId);
  };

  const handleEditClick = () => {
    onEdit(valuation);
  };

  const handleDownloadPdf = () => {
    // Implement download PDF logic
    console.log('Download PDF clicked', valuation.valuationId);
  };

  const handleDeleteClick = () => {
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    onDelete(valuation.valuationId);
    setIsDeleteDialogOpen(false);
  };

  const cancelDelete = () => {
    setIsDeleteDialogOpen(false);
  };

  // Format the date
  const formattedDate = valuation.valuationId ? format(new Date(valuation.valuationId), 'MMM dd, yyyy HH:mm') : 'N/A';

  // Fix the buttons that are missing children prop
  const ActionButtons = () => {
    return (
      <div className="flex items-center space-x-2">
        <CDButton
          variant="ghost"
          size="sm"
          icon={<Eye className="h-4 w-4" />}
          onClick={handleViewDetails}
          ariaLabel="View details"
        >
          View
        </CDButton>
        
        <CDButton
          variant="ghost"
          size="sm"
          icon={<Edit className="h-4 w-4" />}
          onClick={handleEditClick}
          ariaLabel="Edit valuation"
        >
          Edit
        </CDButton>
        
        <CDButton
          variant="ghost"
          size="sm"
          icon={<Download className="h-4 w-4" />}
          onClick={handleDownloadPdf}
          ariaLabel="Download PDF"
        >
          PDF
        </CDButton>
        
        {isQAUser && (
          <CDButton
            variant="ghost"
            size="sm"
            icon={<Trash2 className="h-4 w-4 text-error" />}
            onClick={handleDeleteClick}
            ariaLabel="Delete valuation"
          >
            Delete
          </CDButton>
        )}
      </div>
    );
  };

  return (
    <tr key={valuation.valuationId}>
      <td className="py-2">{valuation.valuationId}</td>
      <td className="py-2">{valuation.make}</td>
      <td className="py-2">{valuation.model}</td>
      <td className="py-2">{valuation.year}</td>
      <td className="py-2">{valuation.mileage}</td>
      <td className="py-2">{valuation.condition}</td>
      <td className="py-2">${valuation.valuation}</td>
      <td className="py-2">{formattedDate}</td>
      <td className="py-2">
        <ActionButtons />
      </td>
      {/* Delete confirmation dialog */}
      {isDeleteDialogOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Delete Valuation</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Are you sure you want to delete this valuation? This action cannot be undone.
                </p>
              </div>
              <div className="items-center px-4 py-3">
                <button
                  className="px-4 py-2 bg-red-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300"
                  onClick={confirmDelete}
                >
                  Delete
                </button>
                <button
                  className="px-4 py-2 bg-gray-200 text-gray-700 text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 mt-2"
                  onClick={cancelDelete}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </tr>
  );
};
