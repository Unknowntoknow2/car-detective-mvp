// src/pages/VinLookupPage.tsx
import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { UnifiedVinLookup } from "@/components/lookup/UnifiedVinLookup";
import { AnnouncementBar } from "@/components/marketing/AnnouncementBar";

export default function VinLookupPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <AnnouncementBar />
      <Navbar />
      <main className="flex-grow container max-w-2xl py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
            VIN Lookup
          </h1>
          <p className="mt-2 text-base sm:text-lg text-muted-foreground">
            Enter your 17-digit VIN to get accurate vehicle insights.
          </p>
        </div>
        <UnifiedVinLookup showHeader />
      </main>
      <Footer />
    </div>
  );
}
