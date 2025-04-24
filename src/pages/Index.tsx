
import { useRef } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturesOverview } from "@/components/home/FeaturesOverview";
import { LookupTabs } from "@/components/home/LookupTabs";

const Index = () => {
  const lookupRef = useRef<HTMLDivElement>(null);

  const scrollToLookup = () => {
    lookupRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSection onFreeValuationClick={scrollToLookup} />
        <FeaturesOverview />
        <section ref={lookupRef} className="py-16 px-4">
          <div className="container mx-auto max-w-4xl">
            <LookupTabs />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
