
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PremiumHero } from '@/components/premium/sections/PremiumHero';
import { PremiumValuationTabs } from '@/components/premium/sections/PremiumValuationTabs';

export default function PremiumPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main>
        <PremiumHero />
        <PremiumValuationTabs />
      </main>
      <Footer />
    </div>
  );
}
