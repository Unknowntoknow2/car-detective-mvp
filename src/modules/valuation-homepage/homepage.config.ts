
/**
 * Car Detective™ Homepage Configuration
 * Contains all content strings, image paths, and config options
 */

export const homepageConfig = {
  hero: {
    tagline: "Know Your Car's True Value — Instantly.",
    subheading: "VIN, License Plate, or Manual Entry. No guessing. No gimmicks.",
    ctaButton: {
      primary: "Get a Free Valuation",
      secondary: "Upgrade to Premium"
    },
    primaryCtaLink: "/valuation/start",
    secondaryCtaLink: "/premium"
  },
  
  steps: [
    {
      id: 1,
      title: "Enter Your Car",
      description: "Input your VIN, license plate, or enter details manually.",
      iconType: "search" // from lucide-react
    },
    {
      id: 2,
      title: "View Live Market Valuation",
      description: "Get real-time valuation based on current market data.",
      iconType: "car" // from lucide-react
    },
    {
      id: 3,
      title: "Download Premium Report",
      description: "Get a detailed report with market analysis and price trends.",
      iconType: "file-text" // from lucide-react
    }
  ],
  
  trustLogos: [
    {
      name: "Stripe",
      alt: "Stripe Logo",
      imageUrl: "/images/logos/stripe-logo.svg" // Placeholder path
    },
    {
      name: "CARFAX",
      alt: "CARFAX Logo",
      imageUrl: "/images/logos/carfax-logo.svg" // Placeholder path
    },
    {
      name: "OpenAI",
      alt: "OpenAI Logo",
      imageUrl: "/images/logos/openai-logo.svg" // Placeholder path
    },
    {
      name: "Supabase",
      alt: "Supabase Logo",
      imageUrl: "/images/logos/supabase-logo.svg" // Placeholder path
    }
  ],
  
  ctaFooter: {
    headline: "Selling a car? Don't guess. Detect it.",
    buttonText: "Get Your Car's Value",
    buttonLink: "/valuation/start",
    subtext: "Used by top dealers and smart sellers across the U.S."
  }
};

export default homepageConfig;
