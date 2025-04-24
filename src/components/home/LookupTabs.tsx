
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { US_STATES } from "@/utils/constants";
import { ManualEntryForm } from "@/components/lookup/ManualEntryForm";
import { toast } from "sonner";

export function LookupTabs() {
  const navigate = useNavigate();
  const [vin, setVin] = useState("");
  const [plate, setPlate] = useState("");
  const [state, setState] = useState("");

  const handleVinSubmit = () => {
    if (vin.length !== 17) {
      toast.error("Please enter a valid 17-character VIN");
      return;
    }
    navigate(`/lookup/vin?vin=${encodeURIComponent(vin)}`);
  };

  const handlePlateSubmit = () => {
    if (!plate) {
      toast.error("Please enter a license plate number");
      return;
    }
    if (!state) {
      toast.error("Please select a state");
      return;
    }
    navigate(`/lookup/plate?plate=${encodeURIComponent(plate)}&state=${encodeURIComponent(state)}`);
  };

  return (
    <Tabs defaultValue="vin" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="vin">VIN Lookup</TabsTrigger>
        <TabsTrigger value="plate">Plate Lookup</TabsTrigger>
        <TabsTrigger value="manual">Manual Entry</TabsTrigger>
      </TabsList>

      <TabsContent value="vin">
        <div className="space-y-4 p-6 bg-white rounded-lg shadow-sm">
          <h4 className="text-lg font-semibold">Vehicle Identification Number (VIN)</h4>
          <Input 
            placeholder="Enter 17-character VIN" 
            value={vin}
            onChange={(e) => setVin(e.target.value.toUpperCase())}
            maxLength={17}
            className="font-mono tracking-wider uppercase"
          />
          <Button onClick={handleVinSubmit} className="w-full">
            Get Vehicle Details
          </Button>
        </div>
      </TabsContent>

      <TabsContent value="plate">
        <div className="space-y-4 p-6 bg-white rounded-lg shadow-sm">
          <h4 className="text-lg font-semibold">License Plate Lookup</h4>
          <Input 
            placeholder="Plate Number" 
            value={plate}
            onChange={(e) => setPlate(e.target.value.toUpperCase())}
            maxLength={8}
            className="uppercase"
          />
          <Select value={state} onValueChange={setState}>
            <SelectTrigger>
              <SelectValue placeholder="Select State" />
            </SelectTrigger>
            <SelectContent>
              {US_STATES.map((state) => (
                <SelectItem key={state.value} value={state.value}>
                  {state.label} ({state.value})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handlePlateSubmit} className="w-full">
            Lookup by Plate
          </Button>
        </div>
      </TabsContent>

      <TabsContent value="manual">
        <div className="space-y-4 p-6 bg-white rounded-lg shadow-sm">
          <h4 className="text-lg font-semibold">Manual Vehicle Entry</h4>
          <ManualEntryForm />
        </div>
      </TabsContent>
    </Tabs>
  );
}
