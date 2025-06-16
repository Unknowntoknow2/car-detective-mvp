
import React from 'react';

interface ValuationResultDisplayProps {
  data: any;
}

export const ValuationResultDisplay: React.FC<ValuationResultDisplayProps> = ({ data }) => {
  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Valuation Result</h3>
      <p className="text-gray-600">Result data will be displayed here</p>
      {data && (
        <div className="mt-4">
          <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default ValuationResultDisplay;
