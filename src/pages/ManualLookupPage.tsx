import React, { useState } from 'react';
import { ManualEntryForm } from '@/components/lookup/ManualEntryForm';
import { ManualEntryFormData } from '@/components/lookup/types/manualEntry';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';

const ManualLookupPage: React.FC = () => {
  const [manualEntryResult, setManualEntryResult] = useState<ManualEntryFormData | null>(null);

  const handleManualSubmit = (vehicleInfo: ManualEntryFormData) => {
    // Process the manual entry form submission
    setManualEntryResult(vehicleInfo);
    toast.success(`Details received for ${vehicleInfo.year} ${vehicleInfo.make} ${vehicleInfo.model}`);
    // Explicitly return a boolean instead of void
    return true;
  };

  return (
    <div className="container mx-auto py-12">
      <Card>
        <CardHeader>
          <CardTitle>Manual Vehicle Entry</CardTitle>
          <CardContent>
            <ManualEntryForm onSubmit={handleManualSubmit} />
          </CardContent>
        </CardHeader>
      </Card>

      {manualEntryResult && (
        <div className="mt-8">
          <h2>Entered Vehicle Details:</h2>
          <pre>{JSON.stringify(manualEntryResult, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default ManualLookupPage;
