
import React from 'react';

interface ValuationScoreBarProps {
  score: number;
}

export const ValuationScoreBar: React.FC<ValuationScoreBarProps> = ({ score }) => {
  return (
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div 
        className="bg-primary h-2 rounded-full" 
        style={{ width: `${score}%` }}
      ></div>
    </div>
  );
};

export default ValuationScoreBar;
