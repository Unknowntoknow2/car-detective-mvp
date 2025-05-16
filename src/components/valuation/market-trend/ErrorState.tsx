
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ErrorStateProps {
  errorMessage: string;
}

export function ErrorState({ errorMessage }: ErrorStateProps) {
  return (
    <Card>
      <CardHeader className="bg-muted/20">
        <CardTitle className="text-lg">Market Trends & Future Value</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="text-center text-muted-foreground py-8">
          <p>{errorMessage || "Unable to load market forecast data"}</p>
        </div>
      </CardContent>
    </Card>
  );
}
