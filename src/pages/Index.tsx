
import { useRef } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { EnhancedHeroSection } from "@/components/home/EnhancedHeroSection";
import { EnhancedFeatures } from "@/components/home/EnhancedFeatures";
import { LookupTabs } from "@/components/home/LookupTabs";

const Index = () => {
  const lookupRef = useRef<HTMLDivElement>(null);

  const scrollToLookup = () => {
    lookupRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 animate-fade-in">
        <EnhancedHeroSection onFreeValuationClick={scrollToLookup} />
        <EnhancedFeatures />
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
