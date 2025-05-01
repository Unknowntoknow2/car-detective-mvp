
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ServiceRecordsList } from './ServiceRecordsList';
import { LoadingState } from './LoadingState';
import { ErrorState } from './ErrorState';
import { EmptyState } from './EmptyState';
import { useServiceHistory } from '@/hooks/useServiceHistory';

interface ServiceHistoryDisplayProps {
  vin: string;
}

export function ServiceHistoryDisplay({ vin }: ServiceHistoryDisplayProps) {
  const { records, isLoading, error } = useServiceHistory(vin);

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  if (records.length === 0) {
    return <EmptyState />;
  }

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Service History
          <Badge variant="outline" className="ml-2">
            {records.length} {records.length === 1 ? 'record' : 'records'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ServiceRecordsList records={records} />
      </CardContent>
    </Card>
  );
}
