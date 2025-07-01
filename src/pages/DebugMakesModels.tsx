
import React from 'react';
import { MakesModelsDisplay } from '@/components/debug/MakesModelsDisplay';

export default function DebugMakesModels() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Database Makes & Models</h1>
        <p className="text-muted-foreground">
          Complete list of all vehicle makes and their associated models from Supabase
        </p>
      </div>
      <MakesModelsDisplay />
    </div>
  );
}
