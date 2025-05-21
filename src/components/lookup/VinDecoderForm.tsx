
// src/components/lookup/VinDecoderForm.tsx

import React from "react";
import VinLookup from "./VinLookup";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface VinDecoderFormProps {
  onSubmit?: (vin: string) => void;
}

const VinDecoderForm: React.FC<VinDecoderFormProps> = ({ onSubmit }) => {
  return (
    <Card className="bg-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">VIN Lookup</CardTitle>
      </CardHeader>
      <CardContent>
        <VinLookup onSubmit={onSubmit} />
      </CardContent>
    </Card>
  );
};

export default VinDecoderForm;
