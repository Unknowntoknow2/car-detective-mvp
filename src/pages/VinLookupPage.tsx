import React, { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import VinDecoderForm from "@/components/lookup/VinDecoderForm"; // ✅ CORRECT import
import ManualEntryForm from "@/components/lookup/manual/ManualEntryForm";
import { AnnouncementBar } from "@/components/marketing/AnnouncementBar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export default function VinLookupPage() {
  const { user } = useAuth();
  const [showManualEntry, setShowManualEntry] = useState(false);

  const toggleManualEntry = () => {
    setShowManualEntry(!showManualEntry);
  };

  const handleManualSubmit = (data: any) => {
    console.log("Manual entry form submitted:", data);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {!user && (
        <div className="flex justify-end mb-6">
          <Button variant="outline" className="flex items-center gap-2" asChild>
            <Link to="/auth">Sign In / Register</Link>
          </Button>
        </div>
      )}

      <AnnouncementBar />
      <Navbar />

      <main className="flex-1 container max-w-2xl py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="space-y-6 sm:space-y-8">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
              VIN Lookup
            </h1>
            <p className="mt-3 sm:mt-4 text-base sm:text-lg text-gray-600">
              Enter your Vehicle Identification Number (VIN) to get detailed information.
            </p>
          </div>

          <VinDecoderForm />

          <Button
            variant="secondary"
            onClick={toggleManualEntry}
            className="w-full"
          >
            {showManualEntry ? "Hide Manual Entry" : "Enter Details Manually"}
          </Button>

          {showManualEntry && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Manual Entry</h2>
              <p className="text-gray-600 mb-6">
                If you prefer, you can manually enter your vehicle details below.
              </p>
              <ManualEntryForm onSubmit={handleManualSubmit} />
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
