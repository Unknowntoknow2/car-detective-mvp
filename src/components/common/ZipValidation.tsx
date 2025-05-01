
import React from 'react';
import { useZipValidation } from '@/hooks/useZipValidation';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Loader2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ZipValidationProps {
  zip: string;
  className?: string;
  compact?: boolean;
}

export function ZipValidation({ zip, className, compact = false }: ZipValidationProps) {
  const { data, loading, error } = useZipValidation(zip);

  if (!zip || zip.length !== 5) {
    return null; // Don't show anything if ZIP is invalid
  }

  if (loading) {
    return compact ? (
      <div className="flex items-center text-xs text-muted-foreground">
        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
        Validating...
      </div>
    ) : (
      <Card className={cn("p-4", className)}>
        <div className="flex items-center">
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          <span className="text-sm">Validating ZIP code...</span>
        </div>
      </Card>
    );
  }

  if (error || !data) {
    return compact ? (
      <div className="flex items-center text-xs text-destructive">
        <AlertCircle className="h-3 w-3 mr-1" />
        Invalid ZIP
      </div>
    ) : (
      <Card className={cn("p-4 border-destructive/50", className)}>
        <div className="flex items-center text-destructive">
          <AlertCircle className="h-4 w-4 mr-2" />
          <span className="text-sm">{error || "Invalid ZIP code"}</span>
        </div>
      </Card>
    );
  }

  const place = data.places[0];
  
  if (compact) {
    return (
      <div className="flex items-center text-xs text-muted-foreground">
        <MapPin className="h-3 w-3 mr-1" />
        {place['place name']}, {place['state abbreviation']}
      </div>
    );
  }

  return (
    <Card className={cn("p-4", className)}>
      <CardContent className="p-0">
        <div className="flex items-start">
          <MapPin className="h-5 w-5 mr-2 text-primary shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">{place['place name']}, {place['state abbreviation']}</p>
            <p className="text-sm text-muted-foreground">{data.country}</p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2 text-xs text-muted-foreground">
              <div>
                <span className="font-medium">Latitude:</span> {place.latitude}
              </div>
              <div>
                <span className="font-medium">Longitude:</span> {place.longitude}
              </div>
              <div className="col-span-2">
                <span className="font-medium">State:</span> {place.state}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
