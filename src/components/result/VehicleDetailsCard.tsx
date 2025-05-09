
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface VehicleDetailsCardProps {
  make?: string;
  model?: string;
  year?: number;
  mileage?: number;
  condition?: string;
  vin?: string;
  trim?: string;
  bodyType?: string;
  fuelType?: string;
  color?: string;
  transmission?: string;
  zipCode?: string;
}

export function VehicleDetailsCard({
  make,
  model,
  year,
  mileage,
  condition,
  vin,
  trim,
  bodyType,
  fuelType,
  color,
  transmission,
  zipCode
}: VehicleDetailsCardProps) {
  // Format mileage with commas
  const formattedMileage = mileage ? mileage.toLocaleString() : 'N/A';
  
  return (
    <Card className="border-primary/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Vehicle Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-x-4 gap-y-3">
            <DetailItem label="Make" value={make} />
            <DetailItem label="Model" value={model} />
            <DetailItem label="Year" value={year?.toString()} />
            <DetailItem label="Mileage" value={mileage ? `${formattedMileage} miles` : 'N/A'} />
            <DetailItem label="Condition" value={condition} capitalize />
            {trim && <DetailItem label="Trim" value={trim} />}
          </div>
          
          {(bodyType || fuelType || color || transmission) && (
            <>
              <Separator />
              <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                {bodyType && <DetailItem label="Body Style" value={bodyType} />}
                {fuelType && <DetailItem label="Fuel Type" value={fuelType} />}
                {color && <DetailItem label="Color" value={color} capitalize />}
                {transmission && <DetailItem label="Transmission" value={transmission} />}
              </div>
            </>
          )}
          
          {vin && (
            <>
              <Separator />
              <DetailItem label="VIN" value={vin} fullWidth />
            </>
          )}
          
          {zipCode && (
            <>
              <Separator />
              <DetailItem label="ZIP Code" value={zipCode} />
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface DetailItemProps {
  label: string;
  value?: string | null;
  capitalize?: boolean;
  fullWidth?: boolean;
}

function DetailItem({ label, value, capitalize = false, fullWidth = false }: DetailItemProps) {
  if (!value) return null;
  
  const classes = capitalize ? 'capitalize' : '';
  
  return (
    <div className={fullWidth ? 'col-span-2' : ''}>
      <p className="text-sm text-muted-foreground">{label}:</p>
      <p className={`font-medium text-sm ${classes}`}>{value}</p>
    </div>
  );
}

export default VehicleDetailsCard;
