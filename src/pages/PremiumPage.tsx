
import { useRef, useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AnnouncementBar } from '@/components/marketing/AnnouncementBar';
import { PremiumHero } from '@/components/premium/sections/PremiumHero';
import { PremiumValuationTabs } from '@/components/premium/sections/PremiumValuationTabs';
import { ComparisonSection } from '@/components/premium/ComparisonSection';
import { EnhancedPremiumFeaturesTabs } from '@/components/premium/features/EnhancedPremiumFeaturesTabs';
import { ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PremiumPage() {
  const formRef = useRef<HTMLDivElement>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);
  
  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  // Add scroll event listener to show/hide back to top button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 500) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  return (
    <div className="min-h-screen bg-slate-50">
      <AnnouncementBar />
      <Navbar />
      <main>
        <PremiumHero scrollToForm={scrollToForm} />
        
        <EnhancedPremiumFeaturesTabs />
        
        <ComparisonSection scrollToForm={scrollToForm} />
        
        <section ref={formRef} id="premium-valuation" className="py-8 sm:py-12 bg-white border-t border-slate-100">
          <PremiumValuationTabs />
        </section>
        
        {showBackToTop && (
          <Button
            onClick={scrollToTop}
            className="fixed bottom-6 right-4 sm:bottom-8 sm:right-6 rounded-full w-10 h-10 sm:w-12 sm:h-12 p-0 bg-primary shadow-lg hover:bg-primary/90 z-50"
            aria-label="Back to top"
          >
            <ChevronUp className="h-5 w-5 sm:h-6 sm:w-6" />
          </Button>
        )}
      </main>
      <Footer />
    </div>
  );
}
