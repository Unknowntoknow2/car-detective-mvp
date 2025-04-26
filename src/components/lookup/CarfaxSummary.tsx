
import { Shield, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CarfaxData } from '@/utils/carfax/mockCarfaxService';

interface CarfaxSummaryProps {
  carfaxData: CarfaxData;
}

export function CarfaxSummary({ carfaxData }: CarfaxSummaryProps) {
  const { accidentsReported, owners, serviceRecords, salvageTitle } = carfaxData;
  const hasIssues = accidentsReported > 0 || salvageTitle;
  
  return (
    <Card className="mt-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>CARFAX Report Summary</CardTitle>
        {hasIssues ? (
          <div className="flex items-center text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            <AlertTriangle className="h-4 w-4 mr-1" />
            <span className="text-xs font-medium">History Issues</span>
          </div>
        ) : (
          <div className="flex items-center text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-200">
            <Shield className="h-4 w-4 mr-1" />
            <span className="text-xs font-medium">Clean History</span>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="border border-slate-200 rounded-md p-3">
            <p className="text-sm text-slate-500">Accidents</p>
            <p className={`text-lg font-semibold ${accidentsReported > 0 ? 'text-amber-600' : 'text-green-600'}`}>
              {accidentsReported} Reported
            </p>
          </div>
          
          <div className="border border-slate-200 rounded-md p-3">
            <p className="text-sm text-slate-500">Owners</p>
            <p className="text-lg font-semibold">
              {owners} {owners === 1 ? 'Owner' : 'Owners'}
            </p>
          </div>
          
          <div className="border border-slate-200 rounded-md p-3">
            <p className="text-sm text-slate-500">Service Records</p>
            <p className="text-lg font-semibold">
              {serviceRecords} Records
            </p>
          </div>
          
          <div className="border border-slate-200 rounded-md p-3">
            <p className="text-sm text-slate-500">Title</p>
            <p className={`text-lg font-semibold ${salvageTitle ? 'text-amber-600' : 'text-green-600'}`}>
              {salvageTitle ? 'Salvage' : 'Clean'}
            </p>
          </div>
        </div>
        
        <div className="mt-4 flex justify-end">
          <a 
            href={carfaxData.reportUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-primary hover:underline text-sm font-medium"
          >
            View Full CARFAX Report →
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
