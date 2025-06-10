
import React from "react";
import { FormData } from "@/types/premium-valuation";

interface ConditionSummaryProps {
  formData: FormData;
}

export function ConditionSummary({ formData }: ConditionSummaryProps) {
  const hasDetailedRatings = formData.conditionRatings && Object.keys(formData.conditionRatings).length > 0;

  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
      <h3 className="text-md font-medium mb-2">Vehicle Condition</h3>
      <div className="space-y-2">
        <div>
          <span className="text-gray-500">Overall Condition: </span>
          <span className="font-medium">{formData.condition}</span>
        </div>
        {hasDetailedRatings && (
          <div>
            <span className="text-gray-500 block mb-1">Detailed Ratings:</span>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {Object.entries(formData.conditionRatings!).map(([key, value]) => (
                <div key={key}>
                  <span className="capitalize">{key}: </span>
                  <span className="font-medium">{value}/5</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {formData.hasAccident && (
          <div>
            <span className="text-gray-500">Accident History: </span>
            <span className="font-medium text-orange-600">Yes</span>
            {formData.accidentDescription && (
              <p className="text-xs text-gray-600 mt-1">{formData.accidentDescription}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
