
import React from "react";
import { SEO } from "@/components/common/SEO";
import { WelcomeBanner } from "@/components/home/WelcomeBanner";
import { MarketingBanner } from "@/components/marketing/MarketingBanner";
import { CarCard } from "@/components/home/CarCard";
import { Footer } from "@/components/home/Footer";

export const EnhancedHomePage = () => {
  const carData = [
    {
      id: 1,
      make: "Toyota",
      model: "Camry",
      year: 2020,
      image: "/images/camry.jpg",
      description: "Reliable and efficient sedan",
    },
    {
      id: 2,
      make: "Honda",
      model: "Civic",
      year: 2019,
      image: "/images/civic.jpg",
      description: "Compact car with great fuel economy",
    },
    {
      id: 3,
      make: "Ford",
      model: "F-150",
      year: 2021,
      image: "/images/f150.jpg",
      description: "Powerful and versatile pickup truck",
    },
  ];

  return (
    <>
      <SEO 
        title="Car Detective — AI-Powered Vehicle Valuation"
        description="Get accurate car valuations with AI-powered market analysis, vehicle history reports, and real auction data. Start your free valuation today!"
        keywords="car valuation, vehicle appraisal, car price, AI car pricing, auction data, vehicle history"
      />
      
      <div className="min-h-screen bg-gradient-to-b from-background via-surface to-background">
        <WelcomeBanner />

        <div className="container py-12">
          <h2 className="text-3xl font-bold text-center mb-8">Featured Vehicles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {carData.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        </div>

        <MarketingBanner
          title="Get Premium Vehicle Insights"
          description="Unlock detailed reports with accident history, market analysis, and more"
          ctaText="Try Premium"
          ctaLink="/premium"
        />

        <Footer />
      </div>
    </>
  );
};
