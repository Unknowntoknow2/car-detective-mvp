import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ProfessionalHero } from '@/components/ui/enhanced/ProfessionalHero';
import { FeatureSection } from '@/components/ui/enhanced/FeatureSection';
import { TestimonialSection } from '@/components/ui/enhanced/TestimonialSection';
import { PricingSection } from '@/components/ui/enhanced/PricingSection';
import { 
  Car, 
  Search, 
  TrendingUp, 
  Shield, 
  BarChart, 
  FileText, 
  Clock, 
  Award,
  Zap,
  Globe,
  Camera,
  DollarSign
} from 'lucide-react';

export default function ProfessionalHomePage() {
  const navigate = useNavigate();

  const heroFeatures = [
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: 'Real-Time Market Data',
      description: 'Get precise valuations powered by real-time market data and industry benchmarks.',
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Expert Validated AI',
      description: 'Our AI is trained and validated by automotive industry experts for accuracy.',
    },
    {
      icon: <DollarSign className="w-6 h-6" />,
      title: 'Precise Value Estimations',
      description: 'Receive accurate appraisals that help you make informed decisions.',
    },
  ];

  const features = [
    {
      icon: <Search className="w-8 h-8" />,
      title: 'VIN Lookup',
      description: 'Lightning fast VIN decoding with comprehensive vehicle history and specifications.',
    },
    {
      icon: <Camera className="w-8 h-8" />,
      title: 'Plate Lookup',
      description: 'Advanced license plate recognition for quick vehicle identification.',
    },
    {
      icon: <Camera className="w-8 h-8" />,
      title: 'AI Photo Analysis',
      description: 'Roboflow-powered image analysis for accurate condition assessment.',
    },
    {
      icon: <BarChart className="w-8 h-8" />,
      title: 'ML Price Predictions',
      description: 'LightGBM machine learning models for accurate price forecasting.',
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: 'CARFAX History',
      description: 'Complete vehicle history reports included free with premium valuations.',
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: 'Real-Time Dealer Offers',
      description: 'Get integrated quotes from verified dealers in your area.',
    },
  ];

  const testimonials = [
    {
      quote: 'Car Price Perfector provided an accurate valuation that exceeded my expectations.',
      author: 'A. Smith',
      role: 'Verified User',
    },
    {
      quote: 'Our valuation report was clear, transparent, and exactly what I needed.',
      author: 'J. Doe', 
      role: 'Automotive Professional',
    },
  ];

  const pricingPlans = [
    {
      name: 'Basic Valuation',
      price: 'FREE',
      period: '',
      description: 'Perfect for getting started with basic vehicle valuations.',
      badge: 'Most Popular',
      features: [
        { text: 'Basic market estimate (national average)', included: true },
        { text: 'Single-photo AI scoring demo', included: true },
        { text: 'CARFAX preview (owners & accident count)', included: true },
        { text: 'Complete CARFAX report', included: false },
        { text: 'Multi-photo AI analysis', included: false },
        { text: 'Dealer network offers', included: false },
      ],
      cta: {
        text: 'Get Basic Valuation',
        onClick: () => navigate('/get-valuation'),
      },
    },
    {
      name: 'Premium Valuation',
      price: '$29.99',
      period: 'One-time fee',
      description: 'Professional valuation report with comprehensive analysis.',
      popular: true,
      badge: 'Includes $44 CARFAX® Report',
      features: [
        { text: 'Complete CARFAX report included', included: true, highlight: true },
        { text: 'Multi-photo AI condition analysis', included: true, highlight: true },
        { text: 'Market price adjustments', included: true },
        { text: 'Comprehensive market analysis', included: true },
        { text: '12-Month value prediction', included: true },
        { text: 'Dealer network offers', included: true, highlight: true },
        { text: 'Instant delivery', included: true },
        { text: 'PDF export option', included: true },
      ],
      cta: {
        text: 'Get Premium Valuation - $29.99',
        onClick: () => navigate('/premium'),
      },
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <ProfessionalHero
        badge="Premium Vehicle Valuation"
        title="Car Price Perfector"
        subtitle="Know Your Car's True Value – No More Guesswork!"
        description="Experience precise, data-driven valuations powered by real-time market data and expert-validated AI. Receive an accurate appraisal of your vehicle in seconds."
        primaryAction={{
          label: 'Get Premium Valuation',
          onClick: () => navigate('/premium'),
          icon: <Award className="w-5 h-5" />,
        }}
        secondaryAction={{
          label: 'Basic Valuation (FREE)',
          onClick: () => navigate('/get-valuation'),
          icon: <Zap className="w-5 h-5" />,
        }}
        features={heroFeatures}
      />

      {/* Key Features Section */}
      <FeatureSection
        title="Key Features"
        description="Our platform offers a comprehensive set of features designed to provide accurate vehicle valuations."
        features={features}
      />

      {/* Testimonials */}
      <TestimonialSection
        title="Trusted by Our Users"
        testimonials={testimonials}
      />

      {/* Data-Driven Approach */}
      <section className="py-20 bg-background">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-16">
            Our Data-Driven Approach
          </h2>
          <p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
            Our valuations are derived from real-time data, industry benchmarks, and in-depth analytics.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              'Millions of Sales Records',
              'Real-Time Data Streams', 
              'Expert-Validated Analytics',
              'Industry-Leading Technology'
            ].map((item, index) => (
              <div key={index} className="text-center animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="text-lg font-semibold text-foreground">{item}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <PricingSection
        title="The Right Solution for Every Need"
        description="Choose the valuation option that best fits your needs."
        plans={pricingPlans}
      />

      {/* Final CTA Section */}
      <section className="py-20 bg-primary/5">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Ready to Discover Your Car's True Worth?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            <span className="text-warning font-semibold">No more guesswork</span> – get the accurate valuation you need today!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <button 
              onClick={() => navigate('/get-valuation')}
              className="bg-outline text-primary border border-primary/30 px-8 py-3 rounded-xl hover:bg-primary/10 transition-colors font-semibold"
            >
              ✓ Basic Valuation (FREE)
            </button>
          </div>
          
          <p className="text-sm text-muted-foreground mt-6">
            ⭕ Premium includes full CARFAX report ($44 value), market analysis, and dealer offers
          </p>
        </div>
      </section>
    </div>
  );
}