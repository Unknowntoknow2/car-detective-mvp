
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturesOverview } from "@/components/home/FeaturesOverview";
import { PremiumTabs } from "@/components/premium/PremiumTabs";

const Index = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <FeaturesOverview />
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
