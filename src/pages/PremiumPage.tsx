import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ProfessionalCard, CardContent, CardHeader, CardTitle } from '@/components/ui/enhanced/ProfessionalCard';
import { ProfessionalButton } from '@/components/ui/enhanced/ProfessionalButton';
import { UnifiedLookupTabs } from '@/components/lookup/UnifiedLookupTabs';
import { cn } from '@/lib/utils';
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
  DollarSign,
  CheckCircle,
  XCircle,
  ArrowRight,
  Clock,
  Star
} from 'lucide-react';

const PremiumPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Premium Hero Section */}
      <section className="relative py-24 lg:py-32 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              PREMIUM VALUATION
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Expert-Grade
              <span className="block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Vehicle Analysis
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 leading-relaxed max-w-3xl mx-auto">
              Professional valuation report with CARFAX, market analysis, and predicted future values that could help you earn hundreds more.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <ProfessionalButton
                size="xl"
                variant="premium"
                onClick={() => navigate('/premium')}
                className="text-lg"
              >
                Get Premium Valuation - $29.99
                <ArrowRight className="w-5 h-5 ml-2" />
              </ProfessionalButton>
              
              <ProfessionalButton
                size="xl"
                variant="outline"
                onClick={() => navigate('/get-valuation')}
                className="text-lg"
              >
                Try Basic Version (FREE)
              </ProfessionalButton>
            </div>
            
            <div className="mt-8 text-center">
              <div className="inline-flex items-center gap-2 text-success">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Includes $44 CARFAX® Report</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vehicle Lookup Section */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Start Your Premium Valuation
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Enter your VIN or license plate to begin your comprehensive vehicle analysis.
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

      {/* Premium Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                What's Included in Your Premium Report
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Get comprehensive insights that go far beyond basic valuations.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  icon: <FileText className="w-8 h-8" />,
                  title: 'Complete Vehicle History',
                  desc: 'Full CARFAX® report shows accidents, service records, previous owners, and title issues.',
                  highlight: 'Includes $44 CARFAX® Report',
                  color: 'bg-blue-500'
                },
                {
                  icon: <Award className="w-8 h-8" />,
                  title: 'Feature-Based Value Adjustments',
                  desc: 'Learn how specific features impact your vehicle\'s value in today\'s market.',
                  highlight: 'Premium Analysis',
                  color: 'bg-yellow-500'
                },
                {
                  icon: <BarChart className="w-8 h-8" />,
                  title: 'Comprehensive Market Analysis',
                  desc: 'See how your vehicle compares to similar listings in your local market and nationally.',
                  highlight: 'Local & National Data',
                  color: 'bg-purple-500'
                },
                {
                  icon: <TrendingUp className="w-8 h-8" />,
                  title: '12-Month Value Prediction',
                  desc: 'Forecast showing the optimal time to sell based on market trends and seasonality.',
                  highlight: 'Future Insights',
                  color: 'bg-green-500'
                },
                {
                  icon: <DollarSign className="w-8 h-8" />,
                  title: 'Dealer Network Offers',
                  desc: 'Compare offers from multiple dealers to get the best price for your vehicle.',
                  highlight: 'Real Offers',
                  color: 'bg-blue-500'
                },
                {
                  icon: <Clock className="w-8 h-8" />,
                  title: 'Instant Delivery',
                  desc: 'Receive your complete report immediately after purchase, with PDF export option.',
                  highlight: 'Immediate Access',
                  color: 'bg-red-500'
                }
              ].map((feature, index) => (
                <ProfessionalCard key={index} variant="elevated" className="group hover:scale-105 transition-all duration-300">
                  <CardContent className="p-8">
                    <div className="flex items-start gap-4">
                      <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300", feature.color)}>
                        {feature.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-xl font-bold text-foreground">
                            {feature.title}
                          </h3>
                          <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full font-medium">
                            {feature.highlight}
                          </span>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">
                          {feature.desc}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </ProfessionalCard>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                One-Time Fee, Lifetime Value
              </h2>
              <p className="text-xl text-muted-foreground">
                Get the most comprehensive vehicle analysis for less than the cost of a single CARFAX report.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Basic Plan */}
              <ProfessionalCard variant="outline" className="text-center">
                <CardHeader className="pb-4">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-foreground mb-2">Basic Valuation</h3>
                    <div className="text-3xl font-bold text-muted-foreground mb-4">FREE</div>
                    <p className="text-muted-foreground">Perfect for getting started</p>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {[
                      'Basic market estimate',
                      'Single-photo AI demo',
                      'CARFAX preview'
                    ].map((feature, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                    {[
                      'Complete CARFAX report',
                      'Multi-photo AI analysis',
                      'Dealer network offers'
                    ].map((feature, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <XCircle className="w-5 h-5 text-muted-foreground/50 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground/50">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <ProfessionalButton 
                    variant="outline" 
                    className="w-full mt-6"
                    onClick={() => navigate('/get-valuation')}
                  >
                    Start Basic Valuation
                  </ProfessionalButton>
                </CardContent>
              </ProfessionalCard>

              {/* Premium Plan */}
              <ProfessionalCard variant="premium" className="text-center border-primary shadow-2xl relative overflow-hidden">
                <div className="absolute top-4 right-4">
                  <span className="bg-primary text-primary-foreground text-xs px-3 py-1 rounded-full font-semibold">
                    RECOMMENDED
                  </span>
                </div>
                
                <CardHeader className="pb-4">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-foreground mb-2">Premium Analysis</h3>
                    <div className="flex items-end justify-center gap-2 mb-2">
                      <span className="text-4xl font-bold text-primary">$29.99</span>
                      <span className="text-lg text-muted-foreground mb-1">one-time</span>
                    </div>
                    <div className="bg-success/10 text-success px-3 py-1 rounded-full text-sm font-medium inline-block mb-4">
                      Includes $44 CARFAX® Report
                    </div>
                    <p className="text-muted-foreground">Professional-grade analysis</p>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {[
                      'Complete CARFAX® report ($44 value)',
                      'Multi-photo AI condition analysis',
                      'Advanced market price adjustments',
                      'Comprehensive market analysis',
                      '12-Month value prediction',
                      'Real-time dealer network offers',
                      'Professional PDF export',
                      'Instant delivery'
                    ].map((feature, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
                        <span className="text-sm text-foreground font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <ProfessionalButton 
                    variant="premium" 
                    className="w-full mt-6"
                    onClick={() => navigate('/premium')}
                  >
                    <Award className="w-5 h-5 mr-2" />
                    Get Premium Valuation - $29.99
                  </ProfessionalButton>
                </CardContent>
              </ProfessionalCard>
            </div>

            {/* Value Proposition */}
            <div className="mt-16 text-center">
              <ProfessionalCard variant="elevated" className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
                <CardContent className="p-8">
                  <div className="flex items-center justify-center gap-4 mb-6">
                    <Shield className="w-8 h-8 text-primary" />
                    <h3 className="text-2xl font-bold text-foreground">Why Choose Premium?</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                    <div>
                      <div className="text-2xl font-bold text-primary mb-2">$44</div>
                      <p className="text-sm text-muted-foreground">CARFAX® Report Value<br />Included FREE</p>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-primary mb-2">12 mo</div>
                      <p className="text-sm text-muted-foreground">Future Value<br />Predictions</p>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-primary mb-2">∞</div>
                      <p className="text-sm text-muted-foreground">Lifetime Access<br />One-Time Fee</p>
                    </div>
                  </div>
                </CardContent>
              </ProfessionalCard>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-muted/30">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Ready for Professional-Grade Analysis?
          </h2>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust our platform for accurate, data-driven vehicle valuations.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto mb-8">
            <ProfessionalButton 
              variant="premium" 
              size="xl"
              onClick={() => navigate('/premium')}
              className="text-lg"
            >
              <Award className="w-5 h-5 mr-2" />
              Get Premium Report - $29.99
            </ProfessionalButton>
          </div>
          
          <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-success" />
              <span>Instant delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-success" />
              <span>30-day satisfaction guarantee</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-success" />
              <span>Expert support</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PremiumPage;