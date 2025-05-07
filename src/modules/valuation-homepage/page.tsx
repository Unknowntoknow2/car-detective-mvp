
import React, { useEffect } from "react";
import ValuationHomepageLayout from "./layout";
import HeroSection from "./sections/HeroSection";
import HowItWorksSection from "./sections/HowItWorksSection";
import TrustLogosSection from "./sections/TrustLogosSection";
import CTAFooterSection from "./sections/CTAFooterSection";

export const ValuationHomepage: React.FC = () => {
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <ValuationHomepageLayout>
      <HeroSection />
      <HowItWorksSection />
      <TrustLogosSection />
      <CTAFooterSection />
    </ValuationHomepageLayout>
  );
};

export default ValuationHomepage;
