
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MIN_FILES, MAX_FILES } from '@/types/photo';

export function PhotoGuidance() {
  return (
    <Card className="bg-slate-50">
      <CardContent className="p-4 text-sm space-y-2">
        <h3 className="font-medium text-slate-900">Photo Guidelines</h3>
        <ul className="list-disc pl-5 space-y-1 text-slate-700">
          <li>Upload {MIN_FILES}-{MAX_FILES} clear photos of your vehicle</li>
          <li>Include exterior shots from multiple angles</li>
          <li>Add clear photos of any damage or issues</li>
          <li>Include at least one interior photo</li>
          <li>Photos should be well-lit and in focus</li>
        </ul>
      </CardContent>
    </Card>
  );
}
