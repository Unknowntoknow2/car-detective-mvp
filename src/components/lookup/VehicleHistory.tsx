
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

interface VehicleHistoryProps {
  vin: string;
  valuationId: string;
}

export const VehicleHistory = ({ vin, valuationId }: VehicleHistoryProps) => {
  const [reportUrl, setReportUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVehicleHistory = async () => {
      if (!vin) return;

      setLoading(true);
      setError(null);

      try {
        const { data, error } = await supabase.functions.invoke('fetch-vehicle-history', {
          body: JSON.stringify({ vin, valuationId })
        });

        if (error) throw error;

        setReportUrl(data.reportUrl);
      } catch (err) {
        console.error('Vehicle history fetch error:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchVehicleHistory();
  }, [vin, valuationId]);

  if (loading) return <p className="text-sm text-muted-foreground">Loading vehicle history...</p>;
  if (error) return <p className="text-sm text-destructive">{error}</p>;
  if (!reportUrl) return null;

  return (
    <div className="mt-4 border border-border rounded-lg p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Vehicle History Report</h3>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => window.open(reportUrl, '_blank')}
        >
          <ExternalLink className="mr-2 h-4 w-4" />
          View Report
        </Button>
      </div>
    </div>
  );
};
