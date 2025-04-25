
import React from 'react';
import { ShieldCheck, AlertTriangle } from 'lucide-react';

interface VehicleHistoryProps {
  historyData: {
    reportUrl: string;
    reportData: {
      owners: number;
      accidentsReported: number;
      damageTypes?: string[];
      serviceRecords: number;
      titleEvents: string[];
      estimatedValueImpact: number;
    };
  };
}

export const VehicleHistoryTab: React.FC<VehicleHistoryProps> = ({ historyData }) => {
  const { reportUrl, reportData } = historyData;
  const hasIssues = reportData.accidentsReported > 0;

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Vehicle History</h2>
        {hasIssues ? (
          <div className="flex items-center text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            <AlertTriangle className="h-4 w-4 mr-1" />
            <span className="text-sm font-medium">History Issues Detected</span>
          </div>
        ) : (
          <div className="flex items-center text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-200">
            <ShieldCheck className="h-4 w-4 mr-1" />
            <span className="text-sm font-medium">Clean History</span>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white border rounded-lg p-4">
          <h3 className="font-semibold mb-2">Ownership</h3>
          <p>{reportData.owners} previous owner{reportData.owners !== 1 ? 's' : ''}</p>
        </div>

        <div className="bg-white border rounded-lg p-4">
          <h3 className="font-semibold mb-2">Accidents</h3>
          <p>{reportData.accidentsReported} reported accident{reportData.accidentsReported !== 1 ? 's' : ''}</p>
          {reportData.damageTypes && (
            <p className="text-sm text-gray-600 mt-1">
              Damage types: {reportData.damageTypes.join(', ')}
            </p>
          )}
        </div>

        <div className="bg-white border rounded-lg p-4">
          <h3 className="font-semibold mb-2">Service History</h3>
          <p>{reportData.serviceRecords} service record{reportData.serviceRecords !== 1 ? 's' : ''}</p>
        </div>

        <div className="bg-white border rounded-lg p-4">
          <h3 className="font-semibold mb-2">Title Information</h3>
          <p>{reportData.titleEvents.join(', ')}</p>
        </div>
      </div>

      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
        <h3 className="font-semibold mb-2">Value Impact</h3>
        <p>
          Estimated value impact: 
          <span className={`ml-2 ${reportData.estimatedValueImpact < 0 ? 'text-red-600' : 'text-green-600'}`}>
            ${Math.abs(reportData.estimatedValueImpact).toLocaleString()}
          </span>
        </p>
      </div>

      <div className="text-center">
        <a 
          href={reportUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-block bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition"
        >
          View Full CARFAX® Report
        </a>
      </div>
    </div>
  );
};
