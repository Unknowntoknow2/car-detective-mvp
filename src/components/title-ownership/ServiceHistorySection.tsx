
import React from 'react';
import { Button } from '@/components/ui/button';
import { ServiceHistoryDisplay } from '../service-history/ServiceHistoryDisplay';
import { ServiceHistoryUploader } from '../service-history/ServiceHistoryUploader';

interface ServiceHistorySectionProps {
  vin: string;
  showServiceUploader: boolean;
  onToggleUploader: () => void;
  onUploadComplete: () => void;
}

export function ServiceHistorySection({ 
  vin, 
  showServiceUploader, 
  onToggleUploader,
  onUploadComplete
}: ServiceHistorySectionProps) {
  return (
    <div className="space-y-4">
      <ServiceHistoryDisplay vin={vin} />
      
      <div className="flex justify-end">
        <Button 
          variant="outline" 
          onClick={onToggleUploader}
        >
          {showServiceUploader ? 'Hide Upload Form' : 'Add Service Record'}
        </Button>
      </div>
      
      {showServiceUploader && (
        <ServiceHistoryUploader 
          initialVin={vin} 
          onUploadComplete={() => {
            onUploadComplete();
            onToggleUploader();
          }}
        />
      )}
    </div>
  );
}
