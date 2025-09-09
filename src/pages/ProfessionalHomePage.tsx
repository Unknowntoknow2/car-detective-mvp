import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ProfessionalHero } from '@/components/ui/enhanced/ProfessionalHero';
import { FeatureSection } from '@/components/ui/enhanced/FeatureSection';
import { TestimonialSection } from '@/components/ui/enhanced/TestimonialSection';
import { PricingSection } from '@/components/ui/enhanced/PricingSection';
import { ProfessionalCard, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/enhanced/ProfessionalCard';
import { ProfessionalButton } from '@/components/ui/enhanced/ProfessionalButton';
import { UnifiedLookupTabs } from '@/components/lookup/UnifiedLookupTabs';
import { cn } from '@/lib/utils';
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

      {/* Vehicle Lookup Section - RESTORED */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Start Your Free Valuation
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Enter your VIN or license plate to get an instant vehicle valuation.
            </p>
          </div>
          
          <ProfessionalCard 
            variant="elevated" 
            className="max-w-4xl mx-auto animate-fade-in"
          >
            <CardContent className="p-8">
              <UnifiedLookupTabs />
            </CardContent>
          </ProfessionalCard>
        </div>
      </section>

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

      {/* Data-Driven Approach - Enhanced to match reference */}
      <section className="py-20 bg-muted/30">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Our Data-Driven Approach
          </h2>
          <p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
            Our valuations are derived from real-time data, industry benchmarks, and in-depth analytics.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
              { title: 'Millions of Sales Records', desc: 'Historical transaction data' },
              { title: 'Real-Time Data Streams', desc: 'Live market updates' }, 
              { title: 'Expert-Validated Analytics', desc: 'Industry-backed algorithms' },
              { title: 'Industry-Leading Technology', desc: 'AI-powered precision' }
            ].map((item, index) => (
              <ProfessionalCard 
                key={index} 
                variant="elevated"
                className="animate-fade-in text-center group hover:scale-105 transition-transform duration-300" 
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {item.desc}
                  </p>
                </CardContent>
              </ProfessionalCard>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Valuation Section - Enhanced */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
                PREMIUM VALUATION
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Expert-Grade Vehicle Analysis
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Professional valuation report with CARFAX, market analysis, and predicted future values that could help you earn hundreds more.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Features List */}
              <div className="space-y-6">
                {[
                  { 
                    icon: <FileText className="w-6 h-6" />,
                    title: 'Complete CARFAX Report',
                    desc: 'Full CARFAX vehicle history with accident records, previous owners, and service impact your vehicle\'s value in the market.',
                    highlight: true
                  },
                  {
                    icon: <BarChart className="w-6 h-6" />,
                    title: 'Comprehensive Market Analysis',
                    desc: 'See how your vehicle compares to similar listings in your local market and nationally.'
                  },
                  {
                    icon: <TrendingUp className="w-6 h-6" />,
                    title: '12-Month Value Prediction',
                    desc: 'Forecast showing the optimal time to sell based on market trends and seasonality.'
                  },
                  {
                    icon: <DollarSign className="w-6 h-6" />,
                    title: 'Dealer Network Offers',
                    desc: 'Compare offers from multiple dealers to get the best price for your vehicle.'
                  },
                  {
                    icon: <Shield className="w-6 h-6" />,
                    title: 'CARFAX® Report Included',
                    desc: 'A $44 value, included free with your premium valuation and delivered instantly after purchase, with PDF export option.',
                    highlight: true
                  }
                ].map((feature, index) => (
                  <div 
                    key={index}
                    className={cn(
                      "flex gap-4 p-4 rounded-lg animate-fade-in",
                      feature.highlight ? "bg-primary/5 border border-primary/20" : "bg-muted/30"
                    )}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className={cn(
                      "flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center",
                      feature.highlight ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"
                    )}>
                      {feature.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">
                        {feature.title}
                      </h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {feature.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pricing Card */}
              <div className="flex items-start justify-center">
                <ProfessionalCard variant="premium" className="w-full animate-scale-in">
                  <CardHeader className="text-center">
                    <div className="text-right mb-4">
                      <span className="text-lg font-semibold text-primary">One-time fee</span>
                    </div>
                    <div className="flex items-end justify-center gap-2 mb-2">
                      <span className="text-5xl font-bold text-primary">$29.99</span>
                    </div>
                    <div className="bg-success/10 text-success px-3 py-1 rounded-full text-sm font-medium">
                      Includes $44 CARFAX® Report
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ProfessionalButton 
                      variant="premium" 
                      size="lg" 
                      className="w-full"
                      onClick={() => navigate('/premium')}
                    >
                      Get Premium Valuation - $29.99
                    </ProfessionalButton>
                    <p className="text-center text-sm text-muted-foreground">
                      Instant Delivery • PDF Export • Expert Support
                    </p>
                  </CardContent>
                </ProfessionalCard>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How We Compare Section */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              How We Compare
            </h2>
          </div>
          
          <div className="max-w-6xl mx-auto overflow-x-auto">
            <div className="min-w-full bg-background rounded-2xl border border-border shadow-lg">
              <div className="grid grid-cols-7 gap-4 p-6 bg-muted/50 rounded-t-2xl">
                <div className="font-semibold text-foreground">FEATURE</div>
                <div className="text-center text-sm font-medium text-muted-foreground">KBB</div>
                <div className="text-center text-sm font-medium text-muted-foreground">CARFAX</div>
                <div className="text-center text-sm font-medium text-muted-foreground">CARMAX</div>
                <div className="text-center text-sm font-medium text-muted-foreground">CARGURUS</div>
                <div className="text-center text-sm font-medium text-muted-foreground">EDMUNDS</div>
                <div className="text-center text-sm font-medium text-primary font-semibold">OURS</div>
              </div>
              
              {[
                ['VIN Lookup', true, true, true, true, true, 'Lightning Fast'],
                ['Plate Lookup', false, true, false, false, false, 'Yes'],
                ['AI Photo Analysis', false, false, false, false, false, 'Roboflow-powered'],
                ['ML Price Predictions', true, true, true, true, true, 'LightGBM Accurate'],
                ['CARFAX History', false, true, true, true, true, 'Free in Premium'],
                ['Real-Time Dealer Offers', false, false, true, true, false, 'Integrated quotes']
              ].map((row, index) => (
                <div key={index} className="grid grid-cols-7 gap-4 p-6 border-t border-border">
                  <div className="font-medium text-foreground">{row[0]}</div>
                  {row.slice(1, 6).map((item, i) => (
                    <div key={i} className="text-center">
                      {typeof item === 'boolean' ? (
                        item ? (
                          <div className="w-5 h-5 bg-success rounded mx-auto flex items-center justify-center">
                            <span className="text-white text-xs">✓</span>
                          </div>
                        ) : (
                          <div className="w-5 h-5 bg-destructive rounded mx-auto flex items-center justify-center">
                            <span className="text-white text-xs">×</span>
                          </div>
                        )
                      ) : (
                        <span className="text-sm text-muted-foreground">{item}</span>
                      )}
                    </div>
                  ))}
                  <div className="text-center">
                    <span className="text-sm font-medium text-primary">{row[6]}</span>
                  </div>
                </div>
              ))}
            </div>
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