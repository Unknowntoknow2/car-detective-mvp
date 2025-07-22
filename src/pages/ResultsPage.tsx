
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, Share2, Car, MapPin, Calendar, Gauge } from 'lucide-react';
import { ValuationSummary } from '@/components/valuation/result/ValuationSummary';
import { EnhancedConfidenceScore } from '@/components/valuation/result/EnhancedConfidenceScore';
import { GoogleStyleListings } from '@/components/market/GoogleStyleListings';
import { MarketDataStatus } from '@/components/valuation/result/MarketDataStatus';
import { FallbackMethodDisclosure } from '@/components/valuation/result/FallbackMethodDisclosure';
import { calculateEnhancedValuation } from '@/services/enhancedValuationEngine';
import { MarketListing, normalizeListing } from '@/types/marketListing';
import { generateValuationPdf } from '@/utils/pdf/generateValuationPdf';

interface ValuationData {
  id: string;
  vin?: string;
  make: string;
  model: string;
  year: number;
  mileage?: number;
  condition?: string;
  estimatedValue: number;
  confidenceScore: number;
  zipCode?: string;
  marketListings: MarketListing[];
  adjustments: any[];
  valuationMethod?: string;
  isUsingFallbackMethod?: boolean;
  basePriceAnchor?: any;
  confidenceBreakdown?: any;
}

export default function ResultsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [valuation, setValuation] = useState<ValuationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helper function to determine if ID is a VIN (17 alphanumeric characters)
  const isVin = (id: string): boolean => {
    return /^[A-HJ-NPR-Z0-9]{17}$/i.test(id);
  };

  // Helper function to validate VIN format
  const validateVin = (vin: string): boolean => {
    return vin.length === 17 && /^[A-HJ-NPR-Z0-9]{17}$/i.test(vin);
  };

  const fetchValuationData = async (identifier: string) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 Fetching valuation data for:', identifier);
      
      let valuationData: ValuationData | null = null;
      
      if (isVin(identifier)) {
        console.log('📍 Detected VIN format, querying by VIN field');
        
        // Try to find existing valuation by VIN
        const { data: existingValuation, error: vinError } = await supabase
          .from('valuations')
          .select('*')
          .eq('vin', identifier)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();
        
        if (vinError) {
          console.warn('⚠️ Error querying by VIN:', vinError);
        }
        
        if (existingValuation) {
          console.log('✅ Found existing valuation for VIN');
          valuationData = {
            id: existingValuation.id,
            vin: existingValuation.vin,
            make: existingValuation.make || 'Unknown',
            model: existingValuation.model || 'Unknown',
            year: existingValuation.year || new Date().getFullYear(),
            mileage: existingValuation.mileage,
            condition: existingValuation.condition || 'good',
            estimatedValue: existingValuation.estimated_value || 0,
            confidenceScore: existingValuation.confidence_score || 0,
            zipCode: existingValuation.state,
            marketListings: [],
            adjustments: [],
            valuationMethod: 'database',
            isUsingFallbackMethod: false
          };
        } else {
          console.log('🔧 No existing valuation found, running enhanced valuation engine');
          
          // Get vehicle info from decoded_vehicles table
          const { data: decodedVehicle } = await supabase
            .from('decoded_vehicles')
            .select('*')
            .eq('vin', identifier)
            .maybeSingle();
          
          if (!decodedVehicle) {
            throw new Error('Vehicle information not found for this VIN');
          }
          
          // Run enhanced valuation with proper market listing integration
          const enhancedResult = await calculateEnhancedValuation({
            vin: identifier,
            make: decodedVehicle.make || 'Unknown',
            model: decodedVehicle.model || 'Unknown',
            year: decodedVehicle.year || new Date().getFullYear(),
            mileage: 50000, // Default, will be updated with follow-up
            condition: 'good',
            zipCode: '90210' // Default, will be updated with follow-up
          });
          
          console.log('🎯 Enhanced valuation result:', enhancedResult);
          
          // Normalize market listings
          const normalizedListings = enhancedResult.marketListings.map(normalizeListing);
          
          valuationData = {
            id: enhancedResult.id || crypto.randomUUID(),
            vin: identifier,
            make: decodedVehicle.make || 'Unknown',
            model: decodedVehicle.model || 'Unknown',
            year: decodedVehicle.year || new Date().getFullYear(),
            mileage: enhancedResult.mileage || 50000,
            condition: enhancedResult.condition || 'good',
            estimatedValue: enhancedResult.estimatedValue,
            confidenceScore: enhancedResult.confidenceScore,
            zipCode: enhancedResult.zipCode || '90210',
            marketListings: normalizedListings,
            adjustments: enhancedResult.adjustments || [],
            valuationMethod: enhancedResult.valuationMethod || 'enhanced',
            isUsingFallbackMethod: enhancedResult.isUsingFallbackMethod || false,
            basePriceAnchor: enhancedResult.basePriceAnchor,
            confidenceBreakdown: enhancedResult.confidenceBreakdown
          };
          
          // Store the valuation result in database
          const { error: insertError } = await supabase
            .from('valuations')
            .insert({
              id: valuationData.id,
              vin: identifier,
              make: valuationData.make,
              model: valuationData.model,
              year: valuationData.year,
              mileage: valuationData.mileage,
              condition: valuationData.condition,
              estimated_value: valuationData.estimatedValue,
              confidence_score: valuationData.confidenceScore,
              state: valuationData.zipCode,
              is_vin_lookup: true,
              base_price: enhancedResult.basePriceAnchor?.price || 0
            });
          
          if (insertError) {
            console.warn('⚠️ Could not store valuation result:', insertError);
          }
        }
      } else {
        console.log('📍 Detected UUID format, querying by ID field');
        
        // Query by UUID
        const { data: uuidValuation, error: uuidError } = await supabase
          .from('valuations')
          .select('*')
          .eq('id', identifier)
          .maybeSingle();
        
        if (uuidError) {
          throw new Error(`Database error: ${uuidError.message}`);
        }
        
        if (!uuidValuation) {
          throw new Error('Valuation not found');
        }
        
        valuationData = {
          id: uuidValuation.id,
          vin: uuidValuation.vin,
          make: uuidValuation.make || 'Unknown',
          model: uuidValuation.model || 'Unknown',
          year: uuidValuation.year || new Date().getFullYear(),
          mileage: uuidValuation.mileage,
          condition: uuidValuation.condition || 'good',
          estimatedValue: uuidValuation.estimated_value || 0,
          confidenceScore: uuidValuation.confidence_score || 0,
          zipCode: uuidValuation.state,
          marketListings: [],
          adjustments: [],
          valuationMethod: 'database',
          isUsingFallbackMethod: false
        };
      }
      
      if (valuationData) {
        setValuation(valuationData);
        
        // Show success toast only after data is loaded
        toast.success(`Valuation Complete: $${valuationData.estimatedValue.toLocaleString()} (${valuationData.confidenceScore}% confidence)`, {
          duration: 5000,
        });
      } else {
        throw new Error('Could not load valuation data');
      }
      
    } catch (err) {
      console.error('❌ Error fetching valuation data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load valuation data');
      toast.error(err instanceof Error ? err.message : 'Failed to load valuation data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      if (isVin(id) && !validateVin(id)) {
        setError('Invalid VIN format');
        setLoading(false);
        return;
      }
      fetchValuationData(id);
    } else {
      setError('No valuation ID provided');
      setLoading(false);
    }
  }, [id]);

  const handleDownloadPdf = async () => {
    if (!valuation) return;
    
    try {
      // Convert ValuationData to UnifiedValuationResult format for PDF
      const unifiedResult: any = {
        id: valuation.id,
        vin: valuation.vin,
        vehicle: {
          year: valuation.year,
          make: valuation.make,
          model: valuation.model,
          trim: '',
          fuelType: ''
        },
        zip: valuation.zipCode || '90210',
        mileage: valuation.mileage,
        baseValue: valuation.estimatedValue,
        adjustments: valuation.adjustments,
        finalValue: valuation.estimatedValue,
        confidenceScore: valuation.confidenceScore,
        aiExplanation: `Valuation based on ${valuation.marketListings.length} market listings`,
        sources: valuation.marketListings.map(l => l.source).filter(Boolean),
        listingCount: valuation.marketListings.length,
        listings: valuation.marketListings,
        timestamp: Date.now(),
        notes: 'Generated from enhanced valuation engine'
      };
      const pdfBlob = await generateValuationPdf(unifiedResult);
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `valuation-${valuation.year}-${valuation.make}-${valuation.model}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error("Could not generate PDF report");
    }
  };

  const handleShare = async () => {
    if (!valuation) return;
    
    const shareUrl = `${window.location.origin}/results/${valuation.id}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${valuation.year} ${valuation.make} ${valuation.model} Valuation`,
          text: `Check out this vehicle valuation: $${valuation.estimatedValue.toLocaleString()}`,
          url: shareUrl,
        });
      } catch (err) {
        console.log('Share canceled or failed:', err);
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Valuation link copied to clipboard");
      } catch (err) {
        console.error('Failed to copy link:', err);
      }
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading valuation data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-red-600">Error</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={() => navigate('/')} variant="outline" className="w-full">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!valuation) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>No Data Found</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">Valuation data could not be loaded.</p>
              <Button onClick={() => navigate('/')} variant="outline" className="w-full">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-6">
        <Button onClick={() => navigate('/')} variant="outline">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>
        <div className="flex gap-2">
          <Button onClick={handleShare} variant="outline">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button onClick={handleDownloadPdf} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Vehicle Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="w-5 h-5" />
                Vehicle Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Year</p>
                  <p className="font-medium">{valuation.year}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Make</p>
                  <p className="font-medium">{valuation.make}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Model</p>
                  <p className="font-medium">{valuation.model}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Mileage</p>
                  <p className="font-medium">{valuation.mileage?.toLocaleString() || 'N/A'} mi</p>
                </div>
              </div>
              {valuation.vin && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm text-muted-foreground">VIN</p>
                  <p className="font-mono text-sm">{valuation.vin}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Fallback Method Disclosure */}
          <FallbackMethodDisclosure
            isFallbackMethod={valuation.isUsingFallbackMethod || false}
            confidenceScore={valuation.confidenceScore}
            marketListingsCount={valuation.marketListings.length}
            estimatedValue={valuation.estimatedValue}
          />

          {/* Market Data Status */}
          <MarketDataStatus 
            marketListings={valuation.marketListings} 
            confidenceScore={valuation.confidenceScore}
            zipCode={valuation.zipCode}
          />

          {/* Market Listings */}
          {valuation.marketListings.length > 0 && (
            <GoogleStyleListings 
              listings={valuation.marketListings}
              vehicleInfo={{
                year: valuation.year,
                make: valuation.make,
                model: valuation.model,
                zipCode: valuation.zipCode
              }}
            />
          )}

          {/* Adjustments */}
          {valuation.adjustments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Valuation Adjustments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {valuation.adjustments.map((adjustment, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b last:border-b-0">
                      <div>
                        <p className="font-medium">{adjustment.factor}</p>
                        <p className="text-sm text-muted-foreground">{adjustment.description}</p>
                      </div>
                      <span className={`font-medium ${adjustment.impact >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {adjustment.impact >= 0 ? '+' : ''}${adjustment.impact.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          {/* Valuation Summary */}
          <ValuationSummary
            estimatedValue={valuation.estimatedValue}
            confidenceScore={valuation.confidenceScore}
            vehicleInfo={{
              year: valuation.year,
              make: valuation.make,
              model: valuation.model,
              mileage: valuation.mileage,
              condition: valuation.condition
            }}
            marketAnchors={{
              exactVinMatch: valuation.marketListings.some(l => l.vin === valuation.vin),
              listingsCount: valuation.marketListings.length,
              trustScore: valuation.confidenceScore / 100
            }}
            sources={valuation.marketListings.map(l => l.source)}
            zipCode={valuation.zipCode}
            priceRange={{
              low: Math.floor(valuation.estimatedValue * 0.90),
              high: Math.ceil(valuation.estimatedValue * 1.10)
            }}
          />

          {/* Enhanced Confidence Score */}
          <Card>
            <CardHeader>
              <CardTitle>Confidence Assessment</CardTitle>
            </CardHeader>
            <CardContent>
              <EnhancedConfidenceScore
                confidenceScore={valuation.confidenceScore}
                confidenceBreakdown={valuation.confidenceBreakdown}
                marketListingsCount={valuation.marketListings.length}
                isFallbackMethod={valuation.isUsingFallbackMethod || false}
                exactVinMatch={valuation.marketListings.some(l => l.vin === valuation.vin)}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
