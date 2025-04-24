
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { ManualEntryForm } from "@/components/lookup/ManualEntryForm";

export function LookupTabs() {
  const navigate = useNavigate();

  const handleManualSubmit = async () => {
    navigate("/lookup/manual");
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
          <Input placeholder="Enter 17-character VIN" />
          <Button onClick={() => navigate("/lookup/vin")} className="w-full">
            Get Vehicle Details
          </Button>
        </div>
      </TabsContent>

      <TabsContent value="plate">
        <div className="space-y-4 p-6 bg-white rounded-lg shadow-sm">
          <h4 className="text-lg font-semibold">License Plate Lookup</h4>
          <Input placeholder="Plate Number" />
          <Input placeholder="State" />
          <Button onClick={() => navigate("/lookup/plate")} className="w-full">
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
