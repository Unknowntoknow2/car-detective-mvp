
import React from "react";
import { FormData } from "@/types/premium-valuation";

interface DrivingBehaviorSummaryProps {
  formData: FormData;
}

export function DrivingBehaviorSummary({ formData }: DrivingBehaviorSummaryProps) {
  const hasDrivingData = formData.drivingBehavior || formData.drivingProfile || formData.annualMileage;

  if (!hasDrivingData) {
    return (
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h3 className="text-md font-medium mb-2">Driving Behavior</h3>
        <p className="text-sm text-gray-500">No driving behavior information provided</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
      <h3 className="text-md font-medium mb-2">Driving Behavior</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        {formData.drivingBehavior && (
          <div>
            <span className="text-gray-500 block">Driving Style</span>
            <span className="font-medium capitalize">{formData.drivingBehavior}</span>
          </div>
        )}
        {formData.drivingProfile && (
          <div>
            <span className="text-gray-500 block">Driving Profile</span>
            <span className="font-medium">{formData.drivingProfile}</span>
          </div>
        )}
        {formData.annualMileage && (
          <div>
            <span className="text-gray-500 block">Annual Mileage</span>
            <span className="font-medium">{formData.annualMileage.toLocaleString()} miles/year</span>
          </div>
        )}
      </div>
    </div>
  );
}
