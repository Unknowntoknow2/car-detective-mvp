
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface VehicleInfo {
  make: string;
  model: string;
  year: number;
  trim?: string;
  engine?: string;
  transmission?: string;
  vin?: string;
  estimatedValue?: number;
}

interface VehicleInfoCardProps {
  vehicleInfo: VehicleInfo;
  className?: string;
}

export const VehicleInfoCard: React.FC<VehicleInfoCardProps> = ({
  vehicleInfo,
  className,
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>
            {vehicleInfo.year} {vehicleInfo.make} {vehicleInfo.model}
          </span>
          {vehicleInfo.estimatedValue && (
            <Badge variant="secondary">
              {formatCurrency(vehicleInfo.estimatedValue)}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 text-sm">
          {vehicleInfo.trim && (
            <div>
              <span className="font-medium">Trim:</span>
              <p className="text-muted-foreground">{vehicleInfo.trim}</p>
            </div>
          )}
          {vehicleInfo.engine && (
            <div>
              <span className="font-medium">Engine:</span>
              <p className="text-muted-foreground">{vehicleInfo.engine}</p>
            </div>
          )}
          {vehicleInfo.transmission && (
            <div>
              <span className="font-medium">Transmission:</span>
              <p className="text-muted-foreground">{vehicleInfo.transmission}</p>
            </div>
          )}
          {vehicleInfo.vin && (
            <div className="col-span-2">
              <span className="font-medium">VIN:</span>
              <p className="text-muted-foreground font-mono text-xs">
                {vehicleInfo.vin}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default VehicleInfoCard;
