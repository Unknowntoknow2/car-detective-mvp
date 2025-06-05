
import React from "react";
import { Info } from "lucide-react";

export function VinInfoMessage() {
  return (
    <div className="flex items-start gap-2 text-xs text-slate-500">
      <Info className="h-4 w-4 flex-shrink-0 mt-0.5" />
      <p>
        The VIN (Vehicle Identification Number) is a 17-character code that can
        be found on your vehicle's registration, insurance card, or on the
        driver's side dashboard.
      </p>
    </div>
  );
}

export default VinInfoMessage;
