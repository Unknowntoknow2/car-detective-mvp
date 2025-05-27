
import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { UnifiedPlateLookup } from '@/components/lookup/UnifiedPlateLookup';
import { AnnouncementBar } from '@/components/marketing/AnnouncementBar';
import { MarketingBanner } from '@/components/marketing/MarketingBanner';

export default function PlateLookupPage() {
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
              Enter your license plate details to get real vehicle information from NHTSA database.
            </p>
          </div>

          <MarketingBanner
            headline="Get comprehensive vehicle insights"
            subtext="Access detailed vehicle specifications, market value, and history with our premium valuation service."
            ctaText="Explore Premium Features"
            ctaHref="/premium"
          />

          <UnifiedPlateLookup showHeader={false} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
