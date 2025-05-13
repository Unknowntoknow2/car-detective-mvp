
import React, { useState } from 'react';
import { VinLookup } from './VinLookup';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const VinDecoderForm = () => {
  return (
    <Card className="bg-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">VIN Lookup</CardTitle>
      </CardHeader>
      <CardContent>
        <VinLookup />
      </CardContent>
    </Card>
  );
};
