
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PremiumTabs } from "@/components/premium/PremiumTabs";

const Index = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 px-4 bg-gradient-to-b from-primary/10 to-background">
          <div className="container mx-auto max-w-5xl text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Know Your Car's True Value — Instantly
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Get an accurate car valuation using real-time market data, AI pricing, and optional CARFAX-backed insights
            </p>
          </div>
        </section>

        {/* Premium Tabs Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <PremiumTabs />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default Index;
