import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ProfessionalCard, CardContent, CardHeader, CardTitle } from '@/components/ui/enhanced/ProfessionalCard';
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
  DollarSign,
  CheckCircle,
  XCircle,
  ArrowRight,
  Briefcase,
  Users
} from 'lucide-react';

export default function ProfessionalHomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 lg:py-32 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="container">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-8 leading-tight">
              Car Price
              <span className="block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Perfector
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 leading-relaxed max-w-3xl mx-auto">
              Know Your Car's True Value – No More Guesswork! Get precise, data-driven valuations powered by real-time market data.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <ProfessionalButton
                size="xl"
                variant="premium"
                onClick={() => navigate('/premium')}
                className="text-lg"
              >
                Get Premium Valuation
                <ArrowRight className="w-5 h-5 ml-2" />
              </ProfessionalButton>
              
              <ProfessionalButton
                size="xl"
                variant="outline"
                onClick={() => navigate('/get-valuation')}
                className="text-lg"
              >
                Basic Valuation (FREE)
              </ProfessionalButton>
            </div>
          </div>
        </div>
      </section>

      {/* Vehicle Lookup Section */}
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
            className="max-w-4xl mx-auto"
          >
            <CardContent className="p-8">
              <UnifiedLookupTabs />
            </CardContent>
          </ProfessionalCard>
        </div>
      </section>

      {/* Trusted by Our Users Section */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-12">
              Trusted by Our Users
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <ProfessionalCard variant="elevated" className="text-left">
              <CardContent className="p-8">
                <div className="text-6xl text-muted-foreground/30 mb-4">"</div>
                <p className="text-lg text-muted-foreground italic mb-6">
                  Car Price Perfector provided an accurate valuation that exceeded my expectations.
                </p>
                <div>
                  <p className="font-semibold text-foreground">A. Smith</p>
                  <p className="text-sm text-muted-foreground">Verified User</p>
                </div>
              </CardContent>
            </ProfessionalCard>
            
            <ProfessionalCard variant="elevated" className="text-left">
              <CardContent className="p-8">
                <div className="text-6xl text-muted-foreground/30 mb-4">"</div>
                <p className="text-lg text-muted-foreground italic mb-6">
                  Our valuation report was clear, transparent, and exactly what I needed.
                </p>
                <div>
                  <p className="font-semibold text-foreground">J. Doe</p>
                  <p className="text-sm text-muted-foreground">Automotive Professional</p>
                </div>
              </CardContent>
            </ProfessionalCard>
          </div>
        </div>
      </section>

      {/* Our Data-Driven Approach Section */}
      <section className="py-20 bg-muted/50">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Our Data-Driven Approach
          </h2>
          <p className="text-xl text-muted-foreground mb-16 max-w-3xl mx-auto leading-relaxed">
            Our valuations are derived from real-time data, industry benchmarks, and in-depth analytics.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {[
              { title: 'Millions of Sales Records', subtitle: 'Records' },
              { title: 'Real-Time Data', subtitle: 'Streams' },
              { title: 'Expert-Validated', subtitle: 'Analytics' },
              { title: 'Industry-Leading', subtitle: 'Technology' }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <h3 className="text-lg font-bold text-foreground mb-1">
                  {item.title}
                </h3>
                <p className="text-sm font-medium text-foreground">
                  {item.subtitle}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Valuation Section */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-left mb-12">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
                PREMIUM VALUATION
              </div>
              <div className="flex justify-between items-start">
                <div className="max-w-2xl">
                  <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                    Expert-Grade Vehicle Analysis
                  </h2>
                  <p className="text-xl text-muted-foreground leading-relaxed">
                    Professional valuation report with CARFAX, market analysis, and predicted future values that could help you earn hundreds more.
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-lg text-primary font-medium">One-time fee</div>
                  <div className="text-5xl font-bold text-primary">$29.99</div>
                  <div className="text-success font-medium">Includes $44 CARFAX® Report</div>
                </div>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {[
                {
                  icon: <FileText className="w-6 h-6" />,
                  title: 'Complete Vehicle History',
                  desc: 'Full CARFAX® report shows accidents, service records, previous owners, and title issues.',
                  color: 'bg-blue-50 text-blue-600'
                },
                {
                  icon: <Award className="w-6 h-6" />,
                  title: 'Feature-Based Value Adjustments',
                  desc: 'Learn how specific features impact your vehicle\'s value in today\'s market.',
                  color: 'bg-yellow-50 text-yellow-600'
                },
                {
                  icon: <BarChart className="w-6 h-6" />,
                  title: 'Comprehensive Market Analysis',
                  desc: 'See how your vehicle compares to similar listings in your local market and nationally.',
                  color: 'bg-purple-50 text-purple-600'
                },
                {
                  icon: <TrendingUp className="w-6 h-6" />,
                  title: '12-Month Value Prediction',
                  desc: 'Forecast showing the optimal time to sell based on market trends and seasonality.',
                  color: 'bg-green-50 text-green-600'
                },
                {
                  icon: <DollarSign className="w-6 h-6" />,
                  title: 'Dealer Network Offers',
                  desc: 'Compare offers from multiple dealers to get the best price for your vehicle.',
                  color: 'bg-blue-50 text-blue-600'
                },
                {
                  icon: <Clock className="w-6 h-6" />,
                  title: 'Instant Delivery',
                  desc: 'Receive your complete report immediately after purchase, with PDF export option.',
                  color: 'bg-red-50 text-red-600'
                }
              ].map((feature, index) => (
                <div key={index} className="flex gap-4 p-6 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div className={cn("flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center", feature.color)}>
                    {feature.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">
                      {feature.title}
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* CARFAX Section */}
            <div className="bg-primary/5 rounded-xl p-6 flex items-center gap-4 mb-12">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-foreground mb-1">
                  CARFAX® Report Included
                </h4>
                <p className="text-sm text-muted-foreground">
                  A $44 value, included free with your premium valuation
                </p>
              </div>
              <ProfessionalButton variant="premium" onClick={() => navigate('/premium')}>
                Get Premium Valuation - $29.99
              </ProfessionalButton>
            </div>
          </div>
        </div>
      </section>

      {/* How We Compare Section */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              How We Compare
            </h2>
          </div>
          
          <div className="max-w-6xl mx-auto">
            <div className="bg-background rounded-xl overflow-hidden shadow-lg border border-border">
              {/* Header Row */}
              <div className="grid grid-cols-7 bg-muted/50 p-4 text-sm font-semibold">
                <div className="text-foreground">FEATURE</div>
                <div className="text-center text-muted-foreground">KBB</div>
                <div className="text-center text-muted-foreground">CARFAX</div>
                <div className="text-center text-muted-foreground">CARMAX</div>
                <div className="text-center text-muted-foreground">CARGURUS</div>
                <div className="text-center text-muted-foreground">EDMUNDS</div>
                <div className="text-center text-primary font-bold">OURS</div>
              </div>
              
              {/* Data Rows */}
              {[
                ['VIN Lookup', true, true, true, true, true, 'Lightning Fast'],
                ['Plate Lookup', false, true, false, false, false, 'Yes'],
                ['AI Photo Analysis', false, false, false, false, false, 'Roboflow-powered'],
                ['ML Price Predictions', 'basic', 'hidden', true, true, true, 'LightGBM Accurate'],
                ['CARFAX History', false, true, true, true, true, 'Free in Premium'],
                ['Real-Time Dealer Offers', false, false, true, true, false, 'Integrated quotes'],
                ['Report PDF Export', true, true, true, false, true, 'Branded Export'],
                ['Forecast Value (12-mo)', false, false, false, false, false, 'Predictive Trend AI'],
                ['UI/UX', '7/10', '6/10', '7/10', '6/10', '8/10', '🚀 10/10']
              ].map((row, index) => (
                <div key={index} className="grid grid-cols-7 p-4 border-t border-border text-sm">
                  <div className="font-medium text-foreground">{row[0]}</div>
                  {row.slice(1, 6).map((cell, i) => (
                    <div key={i} className="text-center flex justify-center">
                      {typeof cell === 'boolean' ? (
                        cell ? (
                          <CheckCircle className="w-5 h-5 text-success" />
                        ) : (
                          <XCircle className="w-5 h-5 text-destructive" />
                        )
                      ) : (
                        <span className={cn(
                          "text-xs px-2 py-1 rounded",
                          cell === 'basic' ? "bg-warning/20 text-warning" :
                          cell === 'hidden' ? "bg-muted text-muted-foreground" :
                          "text-muted-foreground"
                        )}>
                          {cell}
                        </span>
                      )}
                    </div>
                  ))}
                  <div className="text-center">
                    <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                      {row[6]}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* The Right Solution for Every Need */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
              The Right Solution for Every Need
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Sell Smarter */}
            <ProfessionalCard variant="elevated" className="bg-blue-50 border-blue-200">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Car className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-blue-900 mb-4">
                  Sell Smarter,<br />Get More
                </h3>
                <p className="text-blue-700 mb-6 leading-relaxed">
                  Unlock the true value of your car with CARFAX®, AI photo scoring & real-time market offers.
                </p>
                
                <div className="space-y-3 text-left mb-8">
                  <div className="flex items-center gap-3">
                    <Camera className="w-5 h-5 text-blue-600" />
                    <span className="text-sm text-blue-800">AI photo condition analysis</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <span className="text-sm text-blue-800">CARFAX® report included ($44 value)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <DollarSign className="w-5 h-5 text-blue-600" />
                    <span className="text-sm text-blue-800">Compare dealer offers instantly</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-blue-600" />
                    <span className="text-sm text-blue-800">12-month resale value prediction</span>
                  </div>
                </div>
                
                <ProfessionalButton 
                  variant="default" 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => navigate('/premium')}
                >
                  Get Premium Valuation
                </ProfessionalButton>
              </CardContent>
            </ProfessionalCard>

            {/* Buy Confidently */}
            <ProfessionalCard variant="elevated" className="bg-green-50 border-green-200">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-green-900 mb-4">
                  Buy<br />Confidently
                </h3>
                <p className="text-green-700 mb-6 leading-relaxed">
                  Avoid overpaying or buying hidden-damage vehicles. Know the real worth with AI + CARFAX insights.
                </p>
                
                <div className="space-y-3 text-left mb-8">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-green-800">Complete vehicle history</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-green-800">Market price comparison</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Camera className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-green-800">AI condition verification</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Search className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-green-800">Similar listings finder</span>
                  </div>
                </div>
                
                <ProfessionalButton 
                  variant="default" 
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => navigate('/get-valuation')}
                >
                  Check a Vehicle's Value
                </ProfessionalButton>
              </CardContent>
            </ProfessionalCard>

            {/* Tools for Dealers */}
            <ProfessionalCard variant="elevated" className="bg-orange-50 border-orange-200">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Briefcase className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-2xl font-bold text-orange-900 mb-4">
                  Tools for<br />Dealers
                </h3>
                <p className="text-orange-700 mb-6 leading-relaxed">
                  Enterprise-grade valuation, resale forecasting, and trade-in insights to close more deals.
                </p>
                
                <div className="space-y-3 text-left mb-8">
                  <div className="flex items-center gap-3">
                    <Award className="w-5 h-5 text-orange-600" />
                    <span className="text-sm text-orange-800">Unlimited premium valuations</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Camera className="w-5 h-5 text-orange-600" />
                    <span className="text-sm text-orange-800">AI photo scoring at intake</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <DollarSign className="w-5 h-5 text-orange-600" />
                    <span className="text-sm text-orange-800">Trade-in valuation tools</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-orange-600" />
                    <span className="text-sm text-orange-800">Inventory market timing</span>
                  </div>
                </div>
                
                <ProfessionalButton 
                  variant="default" 
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                  onClick={() => navigate('/premium')}
                >
                  Explore Dealer Tools
                </ProfessionalButton>
              </CardContent>
            </ProfessionalCard>
          </div>
        </div>
      </section>

      {/* Ready to Discover Section */}
      <section className="py-20 bg-muted/30">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Ready to Discover Your Car's True Worth?
          </h2>
          <p className="text-xl text-muted-foreground mb-12">
            <span className="text-warning font-semibold">No more guesswork</span> – get the accurate valuation you need today!
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-12">
            <ProfessionalCard variant="elevated" className="text-center">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  CARFAX Integration
                </h3>
                <p className="text-sm text-muted-foreground">
                  Get a complete vehicle history report as part of your premium valuation.
                </p>
              </CardContent>
            </ProfessionalCard>
            
            <ProfessionalCard variant="elevated" className="text-center">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Market Analysis
                </h3>
                <p className="text-sm text-muted-foreground">
                  View current trends and price predictions based on real-time market data.
                </p>
              </CardContent>
            </ProfessionalCard>
            
            <ProfessionalCard variant="elevated" className="text-center">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Enterprise API
                </h3>
                <p className="text-sm text-muted-foreground">
                  Access our machine learning model directly through our developer-friendly API.
                </p>
              </CardContent>
            </ProfessionalCard>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <ProfessionalButton 
              variant="outline" 
              size="lg"
              className="flex-1"
              onClick={() => navigate('/get-valuation')}
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              Basic Valuation (FREE)
            </ProfessionalButton>
          </div>
          
          <div className="flex justify-center mt-4">
            <ProfessionalButton 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/modals')}
              className="text-xs"
            >
              View Professional Modal Components
            </ProfessionalButton>
          </div>
          
          <p className="text-sm text-muted-foreground mt-6">
            <CheckCircle className="w-4 h-4 inline mr-1 text-success" />
            Premium includes full CARFAX report ($44 value), market analysis, and dealer offers
          </p>
        </div>
      </section>
    </div>
  );
}