
import React from "react";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertTriangle, Users } from "lucide-react";

export interface CarfaxHighlightsProps {
  accidentCount?: number;
  owners?: number;
  serviceRecords?: number;
}

export function CarfaxHighlights({ 
  accidentCount = 0, 
  owners = 1, 
  serviceRecords = 5 
}: CarfaxHighlightsProps) {
  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium text-text-secondary">CARFAX® Highlights</h4>
      <div className="grid grid-cols-1 gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {accidentCount === 0 ? (
              <CheckCircle className="h-4 w-4 text-success" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-warning" />
            )}
            <span className="text-sm">Accidents</span>
          </div>
          <Badge variant={accidentCount === 0 ? "default" : "destructive"}>
            {accidentCount === 0 ? "No accidents" : `${accidentCount} reported`}
          </Badge>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            <span className="text-sm">Owners</span>
          </div>
          <Badge variant="outline">{owners}</Badge>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-success" />
            <span className="text-sm">Service Records</span>
          </div>
          <Badge variant="outline">{serviceRecords}</Badge>
        </div>
      </div>
    </div>
  );
}
