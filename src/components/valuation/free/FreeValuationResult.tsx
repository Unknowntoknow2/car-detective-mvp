
import React from 'react';

interface FreeValuationResultProps {
  data: any;
}

export const FreeValuationResult: React.FC<FreeValuationResultProps> = ({ data }) => {
  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Free Valuation Result</h3>
      <p className="text-gray-600">Free valuation result will be displayed here</p>
    </div>
  );
};

export default FreeValuationResult;
