
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ProfessionalHero } from '@/components/ui/enhanced/ProfessionalHero';
import { FeatureSection } from '@/components/ui/enhanced/FeatureSection';
import { PricingSection } from '@/components/ui/enhanced/PricingSection';
import { UnifiedLookupTabs } from '@/components/lookup/UnifiedLookupTabs';
import { ProfessionalCard, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/enhanced/ProfessionalCard';
import { 
  Search, 
  FileText, 
  BarChart, 
  Shield, 
  Award, 
  Zap,
  TrendingUp,
  Camera,
  Globe,
  DollarSign
} from 'lucide-react';

const PremiumPage = () => {
  const navigate = useNavigate();

  const handleVehicleFound = (vehicle: any) => {
    console.log("Vehicle found in premium page:", vehicle);
    // Handle the vehicle data here
  };

  const features = [
    {
      icon: <BarChart className="w-8 h-8" />,
      title: 'Advanced Market Analysis',
      description: 'Comprehensive market trends, pricing insights, and competitive analysis from multiple data sources.',
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: 'Full CARFAX Integration',
      description: 'Complete vehicle history reports with accident history, service records, and ownership details.',
    },
    {
      icon: <Camera className="w-8 h-8" />,
      title: 'AI-Powered Assessment',
      description: 'Roboflow-powered image analysis and LightGBM ML models for precise condition evaluation.',
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: 'Real-Time Dealer Network',
      description: 'Live quotes and offers from verified dealers in your local area.',
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: '12-Month Predictions',
      description: 'Future value forecasting based on market trends and historical data analysis.',
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Expert Validation',
      description: 'AI trained and validated by automotive industry experts for maximum accuracy.',
    },
  ];

  const pricingPlans = [
    {
      name: 'Basic Valuation',
      price: 'FREE',
      period: '',
      description: 'Perfect for getting started with basic vehicle valuations.',
      features: [
        { text: 'Basic market estimate (national average)', included: true },
        { text: 'Single-photo AI scoring demo', included: true },
        { text: 'CARFAX preview (owners & accident count)', included: true },
        { text: 'Complete CARFAX report', included: false },
        { text: 'Multi-photo AI analysis', included: false },
        { text: 'Dealer network offers', included: false },
        { text: '12-month value prediction', included: false },
        { text: 'PDF export', included: false },
      ],
      cta: {
        text: 'Start Basic Valuation',
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
        { text: 'Advanced market price adjustments', included: true },
        { text: 'Comprehensive market analysis', included: true },
        { text: '12-Month value prediction', included: true },
        { text: 'Real-time dealer network offers', included: true, highlight: true },
        { text: 'Professional PDF export', included: true },
        { text: 'Priority customer support', included: true },
      ],
      cta: {
        text: 'Get Premium Valuation - $29.99',
        onClick: () => navigate('/premium'),
      },
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Professional Hero Section */}
      <ProfessionalHero
        badge="Advanced Vehicle Analytics"
        title="Premium Vehicle"
        subtitle="Valuation & Market Intelligence"
        description="Experience the most comprehensive vehicle valuation platform with AI-powered analysis, real-time market data, and expert-validated pricing models."
        primaryAction={{
          label: 'Get Premium Valuation',
          onClick: () => navigate('/premium'),
          icon: <Award className="w-5 h-5" />,
        }}
        secondaryAction={{
          label: 'Try Basic Version',
          onClick: () => navigate('/get-valuation'),
          icon: <Zap className="w-5 h-5" />,
        }}
      />

      {/* Vehicle Lookup Section */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Start Your Valuation
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Enter your vehicle details to get started with our premium valuation service.
            </p>
          </div>
          
          <ProfessionalCard 
            variant="elevated" 
            className="max-w-4xl mx-auto"
          >
            <CardContent className="p-8">
              <UnifiedLookupTabs />
            </CardContent>
          </ProfessionalCard>
        </div>
      </section>

      {/* Features Section */}
      <FeatureSection
        title="Premium Features & Capabilities"
        description="Our platform combines cutting-edge AI technology with real-time market data to deliver the most accurate vehicle valuations in the industry."
        features={features}
        variant="alternate"
      />

      {/* Pricing Section */}
      <PricingSection
        title="Choose Your Valuation Package"
        description="Select the perfect solution for your vehicle valuation needs."
        plans={pricingPlans}
      />

      {/* Final CTA Section */}
      <section className="py-20 bg-primary/5">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Ready for Professional-Grade Analysis?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust our platform for accurate, data-driven vehicle valuations.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <button 
              onClick={() => navigate('/premium')}
              className="bg-primary text-primary-foreground px-8 py-3 rounded-xl hover:bg-primary-dark transition-colors font-semibold transform hover:-translate-y-0.5 hover:shadow-lg"
            >
              <Award className="w-5 h-5 inline mr-2" />
              Get Premium Report
            </button>
          </div>
          
          <p className="text-sm text-muted-foreground mt-6">
            ✓ Instant delivery • ✓ 30-day satisfaction guarantee • ✓ Expert support
          </p>
        </div>
      </section>
    </div>
  );
};

export default PremiumPage;
