
import React from "react";
import VinLookup from "./VinLookup";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface VinDecoderFormProps {
  onSubmit?: (vin: string) => void;
}

const VinDecoderForm: React.FC<VinDecoderFormProps> = ({ onSubmit }) => {
  // Create a handler that safely handles the potentially undefined onSubmit
  const handleSubmit = (vin: string) => {
    if (onSubmit) {
      onSubmit(vin);
    } else {
      console.log("VIN submitted but no handler provided:", vin);
    }
  };

  return (
    <Card className="bg-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">VIN Lookup</CardTitle>
      </CardHeader>
      <CardContent>
        <VinLookup onSubmit={handleSubmit} />
      </CardContent>
    </Card>
  );
};

export default VinDecoderForm;
