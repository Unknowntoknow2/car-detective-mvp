
import React from 'react';

interface ValuationReportProps {
  data: any;
}

export const ValuationReport: React.FC<ValuationReportProps> = ({ data }) => {
  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Valuation Report</h3>
      <p className="text-gray-600">Detailed valuation report will be displayed here</p>
    </div>
  );
};

export default ValuationReport;
