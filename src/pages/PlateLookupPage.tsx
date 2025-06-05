<<<<<<< HEAD

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import PlateDecoderForm from '@/components/lookup/PlateDecoderForm';
import { AnnouncementBar } from '@/components/marketing/AnnouncementBar';
import { MarketingBanner } from '@/components/marketing/MarketingBanner';
=======
import React, { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import PlateDecoderForm from "@/components/lookup/PlateDecoderForm";
import ManualEntryForm from "@/components/lookup/manual/ManualEntryForm";
import { AnnouncementBar } from "@/components/marketing/AnnouncementBar";
import { MarketingBanner } from "@/components/marketing/MarketingBanner";
import { ManualEntryFormData } from "@/components/lookup/types/manualEntry";
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)

export default function PlateLookupPage() {
  const [plateNumber, setPlateNumber] = useState<string | null>(null);
  const [showFollowUp, setShowFollowUp] = useState(false);

  const handlePlateSubmit = (plate: string, state: string) => {
    console.log("Plate submitted:", plate, state);
    setPlateNumber(plate);
    setShowFollowUp(true);
  };

  const handleManualEntryClick = () => {
    // Navigate to manual entry or show manual entry form
    console.log("Manual entry clicked");
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <AnnouncementBar />
      <Navbar />
      <main className="flex-1 container max-w-2xl py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="space-y-6 sm:space-y-8">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
              License Plate Lookup
            </h1>
            <p className="mt-3 sm:mt-4 text-base sm:text-lg text-gray-600">
              Enter your license plate details to get vehicle information.
            </p>
          </div>

          <MarketingBanner
            headline="Unlock detailed vehicle insights"
            subtext="Get access to vehicle specifications, market value, and more with our premium valuation."
            ctaText="Explore Premium Features"
            ctaHref="/premium"
          />

<<<<<<< HEAD
          <PlateDecoderForm onManualEntryClick={handleManualEntryClick} />
=======
          <PlateDecoderForm
            onManualEntryClick={() => setShowManualEntry(true)}
          />

          {showManualEntry && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Manual Entry</h2>
              <p className="text-gray-600 mb-6">
                If you prefer, you can manually enter your vehicle details
                below.
              </p>
              <ManualEntryForm onSubmit={handleManualSubmit} />
            </div>
          )}
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
        </div>
      </main>
      <Footer />
    </div>
  );
}
