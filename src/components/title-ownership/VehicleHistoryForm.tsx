
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Loader2 } from 'lucide-react';
import { TitleStatusSelector } from './TitleStatusSelector';
import { OwnershipHistory } from './OwnershipHistory';

interface VehicleHistoryFormProps {
  titleStatus: string;
  numberOfOwners: number;
  isLoading: boolean;
  onTitleStatusChange: (value: string) => void;
  onNumberOfOwnersChange: (value: number) => void;
  onSaveHistory: () => void;
}

export function VehicleHistoryForm({ 
  titleStatus, 
  numberOfOwners, 
  isLoading, 
  onTitleStatusChange, 
  onNumberOfOwnersChange, 
  onSaveHistory 
}: VehicleHistoryFormProps) {
  return (
    <>
      <div className="grid gap-6 md:grid-cols-2">
        <TitleStatusSelector
          value={titleStatus}
          onChange={onTitleStatusChange}
          required={true}
        />
        
        <OwnershipHistory
          numberOfOwners={numberOfOwners}
          onChange={onNumberOfOwnersChange}
        />
      </div>

      <div className="flex justify-end">
        <Button
          type="button"
          onClick={onSaveHistory}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <FileText className="h-4 w-4 mr-2" />
          )}
          Save Vehicle History
        </Button>
      </div>
    </>
  );
}
