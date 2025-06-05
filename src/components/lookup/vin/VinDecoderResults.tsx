
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle } from "lucide-react";

interface VinDecoderResultsProps {
  data: {
    make?: string;
    model?: string;
    year?: number;
    engine?: string;
    transmission?: string;
    bodyStyle?: string;
    fuelType?: string;
  };
  isLoading?: boolean;
}

export const VinDecoderResults: React.FC<VinDecoderResultsProps> = ({ 
  data, 
  isLoading = false 
}) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Decoding VIN...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-500" />
          Vehicle Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {data.year && data.make && data.model && (
          <div className="flex items-center gap-2">
            <span className="font-medium">Vehicle:</span>
            <Badge variant="secondary">
              {data.year} {data.make} {data.model}
            </Badge>
          </div>
        )}
        
        {data.engine && (
          <div className="flex items-center gap-2">
            <span className="font-medium">Engine:</span>
            <span className="text-sm text-muted-foreground">{data.engine}</span>
          </div>
        )}
        
        {data.transmission && (
          <div className="flex items-center gap-2">
            <span className="font-medium">Transmission:</span>
            <span className="text-sm text-muted-foreground">{data.transmission}</span>
          </div>
        )}
        
        {data.bodyStyle && (
          <div className="flex items-center gap-2">
            <span className="font-medium">Body Style:</span>
            <span className="text-sm text-muted-foreground">{data.bodyStyle}</span>
          </div>
        )}
        
        {data.fuelType && (
          <div className="flex items-center gap-2">
            <span className="font-medium">Fuel Type:</span>
            <span className="text-sm text-muted-foreground">{data.fuelType}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
