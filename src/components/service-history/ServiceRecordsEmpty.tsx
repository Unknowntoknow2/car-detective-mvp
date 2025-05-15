
import React from 'react';
import { FileX } from 'lucide-react';

export const ServiceRecordsEmpty: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <FileX className="h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium mb-2">No Service Records Found</h3>
      <p className="text-muted-foreground max-w-md">
        There are no service records for this vehicle. Add a service record to start tracking maintenance history.
      </p>
    </div>
  );
};

export default ServiceRecordsEmpty;
