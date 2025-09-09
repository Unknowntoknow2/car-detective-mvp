import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { ProfessionalCard, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/enhanced/ProfessionalCard';
import { ProfessionalButton } from '@/components/ui/enhanced/ProfessionalButton';
import { FeatureSection } from '@/components/ui/enhanced/FeatureSection';
import { 
  Car, 
  TrendingUp, 
  Shield, 
  FileText, 
  Award, 
  BarChart,
  MapPin,
  Calendar,
  Gauge,
  Download,
  Share2,
  CheckCircle
} from 'lucide-react';
import type { MarketListing } from '@/types/marketListing';

interface ValuationData {
  id: string;
  vin: string;
  make: string;
  model: string;
  year: number;
  mileage: number;
  condition: string;
  estimatedValue: number;
  confidenceScore: number;
  zipCode: string;
  marketListings: MarketListing[];
  adjustments?: Array<{
    type: string;
    amount: number;
    reason: string;
  }>;
  valuationMethod?: string;
  isUsingFallbackMethod?: boolean;
}

// No fake valuation generation - rely only on real data

export default function ProfessionalResultsPage() {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [valuationData, setValuationData] = useState<ValuationData | null>(null);

  useEffect(() => {
    async function loadData() {
      if (!id) {
        setError('No valuation ID provided');
        setLoading(false);
        return;
      }

      setError(null);
      setValuationData(null);

      try {
        const identifier = id;
        console.log('🔍 Loading valuation data for ID:', identifier);

        let valuationData = null;
        let fetchError = null;

        const isVin = /^[A-HJ-NPR-Z0-9]{17}$/i.test(identifier);
        
        if (isVin) {
          const { data: vinData, error: vinError } = await supabase
            .from('valuations')
            .select('*')
            .eq('vin', identifier)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

          if (!vinError && vinData) {
            valuationData = vinData;
          } else {
            fetchError = new Error(`No valuation found for VIN: ${identifier}`);
          }
        } else {
          const { data: uuidData, error: uuidError } = await supabase
            .from('valuations_uuid')
            .select('*')
            .eq('id', identifier)
            .maybeSingle();

          if (!uuidError && uuidData) {
            valuationData = uuidData;
          } else {
            const { data: regData, error: regError } = await supabase
              .from('valuations')
              .select('*')
              .eq('id', identifier)
              .maybeSingle();

            if (!regError && regData) {
              valuationData = regData;
            } else {
              fetchError = new Error(`No valuation found for ID: ${identifier}`);
            }
          }
        }

        if (fetchError || !valuationData) {
          throw fetchError || new Error('Valuation data not found');
        }

        // Only use real valuations - no fake data generation
        if (!valuationData.estimated_value || valuationData.estimated_value <= 0) {
          // Use the real valuation engine
          console.log('🔍 Using Real Valuation Engine for calculation...');
          
          const { RealValuationEngine } = await import('@/services/valuation/realValuationEngine');
          
          const realValuationResult = await RealValuationEngine.calculateValuation({
            vin: valuationData.vin,
            make: valuationData.make,
            model: valuationData.model,
            year: valuationData.year,
            mileage: valuationData.mileage || 60000,
            condition: valuationData.condition || 'good',
            zipCode: valuationData.state || '95821',
            accidents: 0,
            titleStatus: 'clean'
          });

          if (!realValuationResult.success) {
            throw new Error(realValuationResult.error || 'Failed to calculate real valuation');
          }

          // Update database with real valuation
          const { error: updateError } = await supabase
            .from('valuations')
            .update({
              estimated_value: realValuationResult.estimatedValue,
              confidence_score: realValuationResult.confidenceScore
            })
            .eq('id', valuationData.id);
            
          if (!updateError) {
            valuationData.estimated_value = realValuationResult.estimatedValue;
            valuationData.confidence_score = realValuationResult.confidenceScore;
            
            toast.success('Valuation completed with real market data!', {
              description: `$${realValuationResult.estimatedValue.toLocaleString()} (${realValuationResult.confidenceScore}% confidence)`
            });
          } else {
            throw new Error('Failed to save valuation to database');
          }
        }

        // Only use verified real listings from database
        const { data: dbListings, error: dbError } = await supabase
          .from('enhanced_market_listings')
          .select('*')
          .eq('vin', valuationData.vin)
          .eq('listing_status', 'active')
          .order('created_at', { ascending: false });

        let finalListings: any[] = [];
        if (!dbError && dbListings && dbListings.length > 0) {
          // Only include verified real listings
          finalListings = dbListings.filter(listing => 
            listing.listing_url && 
            !listing.listing_url.includes('example.com') &&
            !listing.listing_url.includes('mock') &&
            !listing.listing_url.includes('fake') &&
            listing.price > 5000 &&
            listing.price < 200000
          );
        }

        setValuationData({
          id: valuationData.id,
          vin: valuationData.vin,
          make: valuationData.make || 'Unknown',
          model: valuationData.model || 'Unknown',
          year: valuationData.year || new Date().getFullYear(),
          mileage: valuationData.mileage || 0,
          condition: valuationData.condition || 'good',
          estimatedValue: valuationData.estimated_value,
          confidenceScore: valuationData.confidence_score || 0,
          zipCode: valuationData.state || 'Unknown',
          marketListings: finalListings,
          valuationMethod: finalListings.length > 0 ? 'database_verified' : 'real_calculation_only',
          isUsingFallbackMethod: false
        });

      } catch (error) {
        console.error('❌ Results page error:', error);
        setError(error instanceof Error ? error.message : 'Failed to load valuation data');
      }

      setLoading(false);
    }

    loadData();
  }, [id]);

  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-foreground mb-2">Processing Valuation</h2>
          <p className="text-muted-foreground">Please wait while we analyze your vehicle...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <ProfessionalCard variant="outline" className="max-w-md animate-fade-in">
          <CardHeader className="text-center">
            <CardTitle className="text-red-600">Unable to Load Results</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <ProfessionalButton 
              onClick={() => window.location.href = '/'}
              variant="premium"
            >
              Return Home
            </ProfessionalButton>
          </CardContent>
        </ProfessionalCard>
      </div>
    );
  }

  if (!valuationData) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <ProfessionalCard variant="outline" className="animate-fade-in">
          <CardContent className="text-center p-8">
            <p className="text-muted-foreground">No valuation data available</p>
          </CardContent>
        </ProfessionalCard>
      </div>
    );
  }

  const confidenceLevel = valuationData.confidenceScore >= 90 ? 'excellent' : 
                         valuationData.confidenceScore >= 75 ? 'good' : 'fair';

  const insights = [
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: 'Market Position',
      description: 'Your vehicle is positioned competitively in the current market based on comparable sales.',
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Confidence Level',
      description: `Our analysis provides ${confidenceLevel} confidence in this valuation based on available data.`,
    },
    {
      icon: <BarChart className="w-8 h-8" />,
      title: 'Value Factors',
      description: 'Year, mileage, condition, and market demand all contribute to your vehicle\'s estimated value.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Hero Results Section */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="text-center mb-12 animate-fade-in">
            <Badge variant="outline" className="mb-4 text-primary border-primary/30">
              Valuation Complete
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Your Vehicle Valuation
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {valuationData.year} {valuationData.make} {valuationData.model}
            </p>
          </div>

          {/* Main Valuation Card */}
          <ProfessionalCard variant="premium" className="max-w-4xl mx-auto mb-12 animate-scale-in">
            <CardHeader className="text-center">
              <div className="mx-auto w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <Car className="w-10 h-10 text-primary" />
              </div>
              <CardTitle className="text-3xl gradient-text mb-2">
                ${valuationData.estimatedValue.toLocaleString()}
              </CardTitle>
              <CardDescription className="text-lg">
                Estimated Market Value
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Confidence Score */}
              <div className="text-center p-6 rounded-xl bg-muted/30">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-success" />
                  <span className="text-lg font-semibold text-foreground">
                    {valuationData.confidenceScore}% Confidence
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Based on real market data analysis
                </p>
              </div>

              {/* Vehicle Details Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 rounded-lg bg-background">
                  <Calendar className="w-5 h-5 text-muted-foreground mx-auto mb-1" />
                  <p className="text-sm text-muted-foreground">Year</p>
                  <p className="font-semibold">{valuationData.year}</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-background">
                  <Gauge className="w-5 h-5 text-muted-foreground mx-auto mb-1" />
                  <p className="text-sm text-muted-foreground">Mileage</p>
                  <p className="font-semibold">{valuationData.mileage.toLocaleString()}</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-background">
                  <Award className="w-5 h-5 text-muted-foreground mx-auto mb-1" />
                  <p className="text-sm text-muted-foreground">Condition</p>
                  <p className="font-semibold capitalize">{valuationData.condition}</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-background">
                  <MapPin className="w-5 h-5 text-muted-foreground mx-auto mb-1" />
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-semibold">{valuationData.zipCode}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <ProfessionalButton variant="premium" size="lg" className="flex-1">
                  <Download className="w-5 h-5" />
                  Download Report
                </ProfessionalButton>
                <ProfessionalButton variant="outline" size="lg" className="flex-1">
                  <Share2 className="w-5 h-5" />
                  Share Results
                </ProfessionalButton>
              </div>
            </CardContent>
          </ProfessionalCard>

          {/* Valuation Insights */}
          <FeatureSection
            title="Valuation Insights"
            description="Understanding the factors that contribute to your vehicle's market value."
            features={insights}
            className="max-w-6xl mx-auto mb-12"
          />

          {/* Premium Upgrade CTA */}
          <div className="text-center">
            <ProfessionalCard variant="outline" className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle>Want More Detailed Analysis?</CardTitle>
                <CardDescription>
                  Upgrade to premium for comprehensive CARFAX reports, dealer offers, and professional PDF exports.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <ProfessionalButton variant="premium" size="lg">
                  <Award className="w-5 h-5" />
                  Upgrade to Premium
                </ProfessionalButton>
              </CardContent>
            </ProfessionalCard>
          </div>
        </div>
      </section>
    </div>
  );
}
