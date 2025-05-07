
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface VehicleDetailsProps {
  make?: string;
  model?: string;
  year?: number | string;
  mileage?: number | string;
  condition?: string;
  zipCode?: string;
}

export const VehicleDetailsCard: React.FC<VehicleDetailsProps> = ({
  make, 
  model, 
  year, 
  mileage,
  condition,
  zipCode
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Vehicle Specifications</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-2 gap-4">
          <div>
            <dt className="text-sm font-medium text-muted-foreground">Make</dt>
            <dd className="text-lg font-semibold">
              {make || 'N/A'}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-muted-foreground">Model</dt>
            <dd className="text-lg font-semibold">
              {model || 'N/A'}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-muted-foreground">Year</dt>
            <dd className="text-lg font-semibold">
              {year || 'N/A'}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-muted-foreground">Mileage</dt>
            <dd className="text-lg font-semibold">
              {typeof mileage === 'number'
                ? mileage.toLocaleString() + ' miles'
                : mileage
                  ? mileage.toString().includes('miles')
                    ? mileage
                    : mileage + ' miles'
                  : 'N/A'}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-muted-foreground">Condition</dt>
            <dd className="text-lg font-semibold">
              {condition || 'N/A'}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-muted-foreground">Location</dt>
            <dd className="text-lg font-semibold">
              {zipCode || 'N/A'}
            </dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
};
