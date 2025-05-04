
import React from 'react';
import { useEpaMpg } from '@/hooks/useEpaMpg';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Info } from 'lucide-react';

interface EpaMpgDisplayProps {
  year: number;
  make: string;
  model: string;
}

export function EpaMpgDisplay({ year, make, model }: EpaMpgDisplayProps) {
  const { data, isLoading, isError } = useEpaMpg(year, make, model);

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading EPA Fuel Economy
          </CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground text-sm">
          Fetching fuel economy data...
        </CardContent>
      </Card>
    );
  }

  if (isError || !data) {
    return (
      <Card className="w-full border-muted bg-muted/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Info className="h-4 w-4" />
            EPA Fuel Economy
          </CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground text-sm">
          Fuel economy data not available for this vehicle.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Info className="h-4 w-4" />
          EPA Fuel Economy
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-1">
          <div className="text-2xl font-bold text-primary">{data.data.value} MPG</div>
          <div className="text-sm text-muted-foreground">{data.data.text}</div>
          <div className="text-xs text-muted-foreground mt-2">
            Source: {data.source === 'api' ? 'EPA Estimate' : 'Cached Value'}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
