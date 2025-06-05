
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera, AlertTriangle, CheckCircle } from "lucide-react";

interface PhotoAnalysisProps {
  conditionData?: any;
  isVisible?: boolean;
}

export const PhotoAnalysis: React.FC<PhotoAnalysisProps> = ({
  conditionData,
  isVisible = true,
}) => {
  if (!isVisible || !conditionData) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-5 w-5" />
          AI Photo Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span className="text-sm">Photo analysis completed</span>
          </div>
          
          {conditionData.overall_score && (
            <div>
              <p className="text-sm font-medium mb-2">Overall Condition Score</p>
              <Badge variant="secondary">
                {conditionData.overall_score}/10
              </Badge>
            </div>
          )}

          {conditionData.damage_areas && conditionData.damage_areas.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-2">Identified Issues</p>
              <div className="space-y-2">
                {conditionData.damage_areas.map((area: any, index: number) => (
                  <div key={index} className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm">{area.description}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
