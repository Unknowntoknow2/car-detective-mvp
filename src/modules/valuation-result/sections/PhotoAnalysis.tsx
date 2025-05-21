
import React from 'react';
import { AICondition } from '@/types/photo';

export interface PhotoAnalysisProps {
  photoUrl?: string;
  photoScore?: number;
  condition: AICondition | null;
  isPremium: boolean;
  onUpgrade: () => void;
}

export const PhotoAnalysis: React.FC<PhotoAnalysisProps> = ({
  photoUrl,
  photoScore,
  condition,
  isPremium,
  onUpgrade
}) => {
  // Simplified implementation
  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-semibold mb-3">Photo Analysis</h3>
      
      {photoUrl ? (
        <div>
          <img 
            src={photoUrl} 
            alt="Vehicle" 
            className="w-full h-48 object-cover rounded-md mb-3" 
          />
          
          {photoScore !== undefined && (
            <div className="mb-3">
              <p className="text-sm font-medium">Photo Quality Score</p>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{ width: `${photoScore * 100}%` }}
                ></div>
              </div>
            </div>
          )}
          
          {condition && (
            <div>
              <p className="font-medium">Condition: {condition.condition}</p>
              <p className="text-sm mt-1">{condition.summary}</p>
              
              {condition.issuesDetected.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm font-medium">Issues Detected:</p>
                  <ul className="text-sm list-disc list-inside">
                    {condition.issuesDetected.map((issue, index) => (
                      <li key={index}>{issue}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8 bg-gray-50 rounded">
          <p className="text-gray-500">No photo analysis available</p>
          {!isPremium && (
            <button 
              onClick={onUpgrade}
              className="mt-2 px-3 py-1 bg-blue-600 text-white text-sm rounded"
            >
              Upgrade to Premium
            </button>
          )}
        </div>
      )}
    </div>
  );
}
