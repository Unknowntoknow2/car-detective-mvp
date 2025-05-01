
import React from 'react';
import { useNhtsaRecalls } from '@/hooks/useNhtsaRecalls';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, AlertCircle, AlertTriangle, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface NhtsaRecallsProps {
  make: string;
  model: string;
  year: number;
  className?: string;
}

export function NhtsaRecalls({ make, model, year, className }: NhtsaRecallsProps) {
  const { data, loading, error } = useNhtsaRecalls(make, model, year);
  
  const handleRefresh = () => {
    window.location.reload();
    toast.success("Refreshing recalls data...");
  };

  if (loading) {
    return (
      <Card className={cn("border-2 border-primary/20", className)}>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
            Loading Recall Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            Retrieving safety recall information from NHTSA...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={cn("border-2 border-destructive/20", className)}>
        <CardHeader>
          <CardTitle className="flex items-center text-destructive">
            <AlertCircle className="h-5 w-5 mr-2" />
            Recall Data Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm mb-4">{error}</div>
          <Button size="sm" onClick={handleRefresh}>Retry</Button>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card className={cn("border-2 border-primary/20", className)}>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Check className="h-5 w-5 mr-2 text-green-500" />
            Safety Recall Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            No open recalls found for this vehicle.
          </div>
          <div className="mt-4 text-xs text-muted-foreground">
            Data provided by the National Highway Traffic Safety Administration (NHTSA)
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("border-2 border-primary/20", className)}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2 text-amber-500" />
          Safety Recalls ({data.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((recall, index) => (
            <div key={recall.NHTSACampaignNumber} className="text-sm">
              {index > 0 && <Separator className="my-4" />}
              <div className="font-semibold text-amber-600">{recall.Component}</div>
              <div className="mt-1">{recall.Summary}</div>
              
              <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                <div><span className="font-medium">Consequence:</span> {recall.Consequence}</div>
                <div><span className="font-medium">Remedy:</span> {recall.Remedy}</div>
                <div><span className="font-medium">Campaign #:</span> {recall.NHTSACampaignNumber}</div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            Data provided by the National Highway Traffic Safety Administration (NHTSA)
          </div>
          <Button size="sm" variant="outline" onClick={handleRefresh}>
            Refresh
          </Button>
        </div>
        
        {/* Valuation impact tip */}
        <div className="mt-4 bg-amber-50 p-3 rounded-md border border-amber-200 text-xs">
          <div className="font-medium text-amber-700 mb-1">Impact on Vehicle Value:</div>
          <div className="text-amber-600">
            Open safety recalls can reduce a vehicle's value by approximately 2% per recall. 
            This vehicle has {data.length} open recall(s), potentially affecting its value by 
            around {(data.length * 2).toFixed(1)}%.
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
