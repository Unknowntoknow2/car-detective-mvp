
import { TabContentWrapper } from "./TabContentWrapper";
import { PlateLookup } from "../../lookup/PlateLookup";
import { Button } from "@/components/ui/button";

interface PlateLookupTabProps {
  plateValue: string;
  stateValue: string;
  isLoading: boolean;
  vehicle: any;
  onPlateChange: (value: string) => void;
  onStateChange: (value: string) => void;
  onLookup: () => void;
}

export function PlateLookupTab({ 
  plateValue, 
  stateValue, 
  isLoading, 
  vehicle, 
  onPlateChange, 
  onStateChange, 
  onLookup 
}: PlateLookupTabProps) {
  return (
    <TabContentWrapper
      title="Plate Lookup"
      description="Enter your license plate and state for quick vehicle identification"
    >
      <PlateLookup
        plateValue={plateValue}
        stateValue={stateValue}
        onPlateChange={onPlateChange}
        onStateChange={onStateChange}
        onLookup={onLookup}
        isLoading={isLoading}
      />
      {vehicle && (
        <div className="mt-8 p-6 bg-slate-50 rounded-lg border border-slate-200">
          <h4 className="font-semibold text-xl mb-4">Vehicle Found</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-slate-500">Year, Make, Model</p>
              <p className="font-medium">{vehicle.year} {vehicle.make} {vehicle.model}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Color</p>
              <p className="font-medium">{vehicle.exteriorColor || "Not available"}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">VIN</p>
              <p className="font-medium">{vehicle.vin || "Not available"}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Registered State</p>
              <p className="font-medium">{stateValue}</p>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            <Button className="bg-primary">Continue to Valuation</Button>
          </div>
        </div>
      )}
    </TabContentWrapper>
  );
}
