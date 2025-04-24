
import { CarfaxData } from '@/utils/carfax/mockCarfaxService';
import { Info, AlertTriangle, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface CarfaxSummaryProps {
  carfaxData: CarfaxData;
}

export const CarfaxSummary = ({ carfaxData }: CarfaxSummaryProps) => {
  const getAccidentSeverityColor = (severity?: string) => {
    if (!severity) return "bg-yellow-500";
    switch (severity) {
      case "severe": return "bg-red-500";
      case "moderate": return "bg-orange-500";
      case "minor": return "bg-yellow-500";
      default: return "bg-yellow-500";
    }
  };

  return (
    <div className="mt-6 border border-border/60 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        <Info className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-medium">Vehicle History Report</h3>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Accident History</p>
          <div className="flex items-center gap-2">
            {carfaxData.accidentsReported > 0 ? (
              <>
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <p className="text-base">
                  {carfaxData.accidentsReported} reported accident{carfaxData.accidentsReported > 1 ? 's' : ''}
                  {carfaxData.damageSeverity && (
                    <Badge className={`ml-2 ${getAccidentSeverityColor(carfaxData.damageSeverity)} text-white`}>
                      {carfaxData.damageSeverity} damage
                    </Badge>
                  )}
                </p>
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 text-green-500" />
                <p className="text-base">No accidents reported</p>
              </>
            )}
          </div>
        </div>
        
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Title Information</p>
          <div className="flex items-center gap-2">
            {carfaxData.salvageTitle ? (
              <>
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <p className="text-base">
                  Salvage Title
                  {carfaxData.brandedTitle && (
                    <Badge variant="outline" className="ml-2 text-red-500 border-red-200">
                      {carfaxData.brandedTitle}
                    </Badge>
                  )}
                </p>
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 text-green-500" />
                <p className="text-base">Clean Title</p>
              </>
            )}
          </div>
        </div>
        
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Ownership</p>
          <div className="flex items-center gap-2">
            <p className="text-base">
              {carfaxData.owners === 1 
                ? "One-owner vehicle"
                : `${carfaxData.owners} previous owners`}
            </p>
          </div>
        </div>
        
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Service History</p>
          <div className="flex items-center gap-2">
            {carfaxData.serviceRecords > 6 ? (
              <>
                <CheckCircle className="h-4 w-4 text-green-500" />
                <p className="text-base">Complete service history ({carfaxData.serviceRecords} records)</p>
              </>
            ) : carfaxData.serviceRecords > 0 ? (
              <p className="text-base">{carfaxData.serviceRecords} service records found</p>
            ) : (
              <p className="text-base">No service records found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
