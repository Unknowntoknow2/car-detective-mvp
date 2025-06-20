
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Shield, AlertTriangle, CheckCircle, Info } from "lucide-react";
import { useNicbVinCheck } from "@/hooks/useNicbVinCheck";

function VinInfoMessage() {
  return (
    <div className="flex items-start gap-2 mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
      <Info className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
      <div className="text-sm text-blue-700">
        <p>A VIN (Vehicle Identification Number) is a unique 17-character code that identifies your vehicle.</p>
        <p className="mt-1">You can find it on your dashboard, driver's side door frame, or vehicle registration.</p>
      </div>
    </div>
  );
}

export function NicbVinCheck() {
  const [inputVin, setInputVin] = useState("");
  const { data, loading, error, checkVin } = useNicbVinCheck();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputVin.trim()) {
      await checkVin(inputVin.trim().toUpperCase());
    }
  };

  const handleVinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().replace(/[^A-HJ-NPR-Z0-9]/g, "");
    if (value.length <= 17) {
      setInputVin(value);
    }
  };

  const renderResult = () => {
    if (!data) return null;

    const isClean = !data.theft_indicator && !data.export_indicator;

    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {isClean ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-red-500" />
            )}
            NICB Check Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-2 flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Theft Status
                </h3>
                <p className={`text-sm ${data.theft_indicator ? 'text-red-600' : 'text-green-600'}`}>
                  {data.theft_indicator ? "⚠️ Theft record found" : "✅ No theft records"}
                </p>
              </div>

              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-2 flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Export Status
                </h3>
                <p className={`text-sm ${data.export_indicator ? 'text-red-600' : 'text-green-600'}`}>
                  {data.export_indicator ? "⚠️ Export record found" : "✅ No export records"}
                </p>
              </div>
            </div>

            {(data.theft_indicator || data.export_indicator) && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  This vehicle has been reported to NICB. Please exercise caution and verify all documentation before purchasing.
                </AlertDescription>
              </Alert>
            )}

            <div className="text-xs text-gray-500 mt-4">
              <p>Data provided by National Insurance Crime Bureau (NICB)</p>
              <p>Last checked: {new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="vin">Vehicle Identification Number (VIN)</Label>
          <Input
            id="vin"
            value={inputVin}
            onChange={handleVinChange}
            placeholder="Enter 17-character VIN"
            maxLength={17}
            className="mt-1"
          />
          <VinInfoMessage />
        </div>

        <Button
          type="submit"
          disabled={loading || inputVin.length !== 17}
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Checking VIN...
            </>
          ) : (
            "Check VIN"
          )}
        </Button>
      </form>

      {error && (
        <Alert className="mt-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {renderResult()}
    </div>
  );
}

export default NicbVinCheck;
