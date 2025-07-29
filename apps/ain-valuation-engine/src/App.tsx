import React from "react";
import { VinLookupForm } from "@/components/lookup/vin/VinLookupForm";
import { DecodedVehicle } from "@/types/DecodedVehicle";

function App() {
  const handleDecodedVin = (data: DecodedVehicle[]) => {
    console.log("Decoded VIN result:", data);
    // TODO: Navigate to follow-up form or store in state
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
      <VinLookupForm onSuccess={handleDecodedVin} />
    </div>
  );
}

export default App;
