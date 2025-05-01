
import React from 'react';
import { useNhtsaRecalls } from '@/hooks/useNhtsaRecalls';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface NhtsaRecallsProps {
  make: string;
  model: string;
  year: number;
  className?: string;
}

export function NhtsaRecalls({ make, model, year, className }: NhtsaRecallsProps) {
  const { data, loading, error } = useNhtsaRecalls(make, model, year);

  if (loading) {
    return (
      <Card className={cn("border-2 border-primary/20", className)}>
        <CardHeader className="space-y-1">
          <CardTitle className="text-xl flex items-center">
            <Loader2 className="h-5 w-5 mr-2 animate-spin text-primary" />
            NHTSA Recalls
          </CardTitle>
          <CardDescription>Loading vehicle recall information...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-6">
          <div className="text-center text-muted-foreground text-sm">
            Checking for recalls from the National Highway Traffic Safety Administration...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={cn("border-2 border-destructive/30", className)}>
        <CardHeader className="space-y-1">
          <CardTitle className="text-xl flex items-center text-destructive">
            <AlertCircle className="h-5 w-5 mr-2" />
            NHTSA Recalls Error
          </CardTitle>
          <CardDescription>Failed to load recall information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-destructive/10 rounded-lg">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card className={cn("border-2 border-primary/20", className)}>
        <CardHeader className="space-y-1">
          <CardTitle className="text-xl flex items-center">
            <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
            NHTSA Recalls
          </CardTitle>
          <CardDescription>Vehicle recall information from NHTSA</CardDescription>
        </CardHeader>
        <CardContent className="py-6">
          <div className="text-center flex flex-col items-center justify-center">
            <CheckCircle className="h-12 w-12 text-green-500 mb-3" />
            <p className="text-muted-foreground">No open recalls found for this vehicle.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("border-2 border-amber-500/30", className)}>
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-amber-500" />
            NHTSA Recalls
          </CardTitle>
          <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-300">
            {data.length} {data.length === 1 ? "Recall" : "Recalls"}
          </Badge>
        </div>
        <CardDescription>
          Open recalls from the National Highway Traffic Safety Administration
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((recall) => (
            <div key={recall.NHTSACampaignNumber} className="border rounded-lg p-4 bg-amber-50/50">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium">{recall.Component}</h4>
                <Badge variant="outline" className="text-xs">
                  {recall.NHTSACampaignNumber}
                </Badge>
              </div>
              <p className="text-sm mb-2">{recall.Summary}</p>
              
              <div className="mt-3 space-y-2 text-xs">
                <div>
                  <p className="font-medium text-amber-700">Consequence:</p>
                  <p className="text-muted-foreground">{recall.Consequence}</p>
                </div>
                <div>
                  <p className="font-medium text-green-700">Remedy:</p>
                  <p className="text-muted-foreground">{recall.Remedy}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
