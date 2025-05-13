
import React from 'react';
import { CalendarDays, Activity, Gauge, Car, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export interface UnifiedValuationHeaderProps {
  year?: number;
  make?: string;
  model?: string;
  estimatedValue?: number; // Changed from valuation to estimatedValue for consistency
  confidenceScore?: number;
  condition?: string;
  zipCode?: string; // Changed from location to zipCode for consistency
  mileage?: number;
  vin?: string;
  trim?: string; // Added trim property
  onDownloadPdf?: () => void;
  onShareReport?: () => void;
  onShare?: () => void; // Added onShare property
  onDownload?: () => void; // Added onDownload property
  onSaveToAccount?: () => Promise<void>;
  isLoading?: boolean;
  headerType?: 'basic' | 'detailed';
  isSaved?: boolean;
  isPremium?: boolean;
  photoSubmitted?: boolean;
  photoCondition?: any;
  calculationInProgress?: boolean;
  bestPhotoUrl?: string;
  isSaving?: boolean;
  vehicleInfo?: any;
  displayMode?: string;
}

export function UnifiedValuationHeader({
  year,
  make,
  model,
  estimatedValue,
  confidenceScore,
  condition,
  zipCode,
  mileage,
  vin,
  trim,
  headerType = 'detailed',
  isSaved,
  isPremium
}: UnifiedValuationHeaderProps) {
  return (
    <div className="flex flex-col space-y-3">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {year} {make} {model}
          </h2>
          {headerType === 'detailed' && vin && (
            <p className="mt-1 text-gray-500 text-sm font-mono">
              VIN: {vin}
            </p>
          )}
        </div>
        {isPremium && (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            Premium Report
          </Badge>
        )}
      </div>
      
      {headerType === 'detailed' && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
          {mileage !== undefined && (
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gray-100 rounded-md">
                <Car className="h-4 w-4 text-gray-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Mileage</p>
                <p className="text-sm font-medium">{mileage.toLocaleString()} mi</p>
              </div>
            </div>
          )}
          
          {condition && (
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gray-100 rounded-md">
                <Car className="h-4 w-4 text-gray-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Condition</p>
                <p className="text-sm font-medium capitalize">{condition}</p>
              </div>
            </div>
          )}
          
          {year && (
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gray-100 rounded-md">
                <CalendarDays className="h-4 w-4 text-gray-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Year</p>
                <p className="text-sm font-medium">{year}</p>
              </div>
            </div>
          )}
          
          {zipCode && (
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gray-100 rounded-md">
                <MapPin className="h-4 w-4 text-gray-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">ZIP Code</p>
                <p className="text-sm font-medium">{zipCode}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default UnifiedValuationHeader;
