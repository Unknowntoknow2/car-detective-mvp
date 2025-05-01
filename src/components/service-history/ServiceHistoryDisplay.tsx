
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, FileText, AlertTriangle, Calendar, Gauge } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ServiceRecord {
  id: number;
  vin: string;
  service_date: string;
  mileage: number | null;
  description: string;
  receipt_url: string;
  created_at: string;
}

interface ServiceHistoryDisplayProps {
  vin: string;
}

export function ServiceHistoryDisplay({ vin }: ServiceHistoryDisplayProps) {
  const [records, setRecords] = useState<ServiceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServiceHistory = async () => {
      if (!vin) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Using manual query since TypeScript doesn't know about our new tables yet
        const { data, error } = await supabase
          .from('service_history')
          .select('*')
          .eq('vin', vin)
          .order('service_date', { ascending: false });

        if (error) throw error;

        setRecords(data as ServiceRecord[] || []);
      } catch (err: any) {
        setError(err.message || 'Failed to load service history');
        console.error('Error fetching service history:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchServiceHistory();
  }, [vin]);

  const openReceipt = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading service history...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-40 text-red-500">
        <AlertTriangle className="h-8 w-8 mb-2" />
        <p>{error}</p>
      </div>
    );
  }

  if (records.length === 0) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-md p-4 text-amber-800">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          <h3 className="font-medium">No service records found</h3>
        </div>
        <p className="text-sm">
          No service history records have been uploaded for this vehicle yet. 
          A complete service history can positively impact your vehicle's value.
        </p>
      </div>
    );
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
        <div className="space-y-4">
          {records.map((record) => (
            <div key={record.id} className="border rounded-lg p-3 hover:bg-gray-50 transition-colors">
              <div className="flex flex-wrap justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">{formatDate(record.service_date)}</span>
                </div>
                {record.mileage && (
                  <div className="flex items-center gap-1 text-gray-600">
                    <Gauge className="h-4 w-4" />
                    <span>{record.mileage.toLocaleString()} miles</span>
                  </div>
                )}
              </div>
              
              {record.description && (
                <p className="text-gray-700 mb-2">{record.description}</p>
              )}
              
              {record.receipt_url && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => openReceipt(record.receipt_url)}
                  className="mt-1"
                >
                  <FileText className="h-4 w-4 mr-1" />
                  View Receipt
                </Button>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
