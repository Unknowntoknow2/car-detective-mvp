
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function LoadingState() {
  return (
    <Card>
      <CardHeader className="bg-muted/20">
        <CardTitle className="text-lg">Market Trends & Future Value</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <Skeleton className="h-[200px] w-full" />
      </CardContent>
    </Card>
  );
}
