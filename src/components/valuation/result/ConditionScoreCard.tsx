
import React from 'react';

interface ConditionScoreCardProps {
  condition: string;
  score: number;
}

export const ConditionScoreCard: React.FC<ConditionScoreCardProps> = ({ condition, score }) => {
  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm">
      <h3 className="font-semibold text-lg mb-2">Vehicle Condition</h3>
      <div className="flex items-center justify-between">
        <span className="text-lg">{condition}</span>
        <span className="text-lg font-bold">{score}/100</span>
      </div>
    </div>
  );
};

export default ConditionScoreCard;
