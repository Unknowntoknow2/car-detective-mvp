
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Info } from 'lucide-react';

interface PhotoAnalysisProps {
  photoScore?: number;
  photoUrl?: string;
  issues?: string[];
  summary?: string;
}

export const PhotoAnalysis: React.FC<PhotoAnalysisProps> = ({
  photoScore = 0,
  photoUrl,
  issues = [],
  summary
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Photo Analysis</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {photoUrl ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                <img 
                  src={photoUrl} 
                  alt="Vehicle" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Photo Quality Score</span>
                  <span className="text-sm font-semibold">{photoScore}%</span>
                </div>
                <Progress value={photoScore} className="h-2" />
              </div>
              
              {issues.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Issues Detected</h4>
                  <ul className="space-y-1 text-sm">
                    {issues.map((issue, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="w-1 h-1 rounded-full bg-red-500 mt-1.5" />
                        <span>{issue}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {summary && (
                <div>
                  <h4 className="text-sm font-medium mb-1">Summary</h4>
                  <p className="text-sm text-muted-foreground">{summary}</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 py-3 text-muted-foreground">
            <Info className="h-5 w-5" />
            <p>No photos provided for analysis. Photos may help improve the accuracy of your valuation.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PhotoAnalysis;
