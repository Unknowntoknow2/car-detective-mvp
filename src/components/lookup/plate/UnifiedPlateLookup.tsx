
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { PlateInfoCard } from "./PlateInfoCard";
import { usePlateLookup } from "@/hooks/usePlateLookup";
import { StateSelect } from "@/components/premium/form/steps/StateSelect";

export function UnifiedPlateLookup() {
  const [plate, setPlate] = useState("");
  const [state, setState] = useState("");
  const { result, isLoading, error, lookupVehicle, clearData } = usePlateLookup();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (plate && state) {
      await lookupVehicle(plate, state);
    }
  };

  const handleDownloadPdf = () => {
    // Implementation for PDF download
    console.log("Downloading PDF for plate:", plate);
  };

  const handleSaveValuation = () => {
    // Implementation for saving valuation
    console.log("Saving valuation for plate:", plate);
  };

  const handleReset = () => {
    setPlate("");
    setState("");
    clearData();
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>License Plate Lookup</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="plate">License Plate</Label>
                <Input
                  id="plate"
                  value={plate}
                  onChange={(e) => setPlate(e.target.value.toUpperCase())}
                  placeholder="ABC123"
                  required
                />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <StateSelect
                  value={state}
                  onChange={setState}
                  disabled={isLoading}
                />
              </div>
            </div>
            
            {error && (
              <div className="text-red-600 text-sm">{error}</div>
            )}
            
            <div className="flex gap-2">
              <Button type="submit" disabled={!plate || !state || isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Looking up...
                  </>
                ) : (
                  "Lookup Vehicle"
                )}
              </Button>
              
              {result && (
                <Button type="button" variant="outline" onClick={handleReset}>
                  New Search
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {result && (
        <PlateInfoCard
          vehicleInfo={result}
          onDownloadPdf={handleDownloadPdf}
          onSaveValuation={handleSaveValuation}
          isUserLoggedIn={true}
        />
      )}
    </div>
  );
}

export default UnifiedPlateLookup;
