// src/components/premium/hero/CarfaxHighlights.tsx

import React from "react";
import { ShieldCheck, AlertTriangle, BadgeCheck, Wrench, User2 } from "lucide-react";

export interface CarfaxHighlightsProps {
  accidentCount: number;
  accidentSeverity?: "minor" | "moderate" | "major";
  owners: number;
  serviceRecords: number;
  brandedTitle?: boolean;
  lastReportedMileage?: number;
}

export const CarfaxHighlights: React.FC<CarfaxHighlightsProps> = ({
  accidentCount,
  accidentSeverity,
  owners,
  serviceRecords,
  brandedTitle,
  lastReportedMileage,
}) => (
  <div className="rounded-xl border bg-background p-4 shadow-lg space-y-2">
    <h3 className="text-lg font-semibold flex items-center mb-2">
      <ShieldCheck className="h-5 w-5 text-primary mr-2" />
      CARFAX Highlights
    </h3>
    <div className="flex flex-wrap gap-3">
      <div className="flex items-center gap-2">
        <User2 className="h-4 w-4 text-muted" />
        <span className="text-sm">{owners} Owner{owners === 1 ? "" : "s"}</span>
      </div>
      <div className="flex items-center gap-2">
        <Wrench className="h-4 w-4 text-muted" />
        <span className="text-sm">{serviceRecords} Service Record{serviceRecords === 1 ? "" : "s"}</span>
      </div>
      <div className="flex items-center gap-2">
        <AlertTriangle
          className={`h-4 w-4 ${
            accidentCount > 0 ? "text-destructive" : "text-success"
          }`}
        />
        <span className="text-sm">
          {accidentCount > 0
            ? `${accidentCount} Accident${accidentCount > 1 ? "s" : ""} (${accidentSeverity ?? "Reported"})`
            : "No Accidents"}
        </span>
      </div>
      {brandedTitle && (
        <div className="flex items-center gap-2">
          <BadgeCheck className="h-4 w-4 text-warning" />
          <span className="text-sm text-warning">Branded Title</span>
        </div>
      )}
      {lastReportedMileage && (
        <div className="flex items-center gap-2">
          <Wrench className="h-4 w-4 text-muted" />
          <span className="text-sm">Mileage: {lastReportedMileage.toLocaleString()} mi</span>
        </div>
      )}
    </div>
  </div>
);

export default CarfaxHighlights;
