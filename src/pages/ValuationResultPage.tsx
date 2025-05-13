
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ValuationComplete } from '@/components/valuation/ValuationComplete';
import { Button } from '@/components/ui/button';
import { UnifiedValuationResult } from '@/components/valuation/UnifiedValuationResult';
import NotFound from './NotFound';
import { downloadPdf } from '@/utils/pdf';
import { toast } from '@/components/ui/use-toast';

export default function ValuationResultPage() {
  const [loading, setLoading] = useState(true);
  const [valuation, setValuation] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const location = useLocation();
  const navigate = useNavigate();
  const [notFoundState, setNotFoundState] = useState(false);
  
  // Parse the ID from the URL query parameters
  const getValuationId = () => {
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get('id');
    
    // If no ID in URL, check localStorage for latest_valuation_id
    if (!id) {
      const storedId = localStorage.getItem('latest_valuation_id');
      if (storedId) {
        // Update URL with the stored ID
        queryParams.set('id', storedId);
        navigate(`${location.pathname}?${queryParams.toString()}`, { replace: true });
        return storedId;
      }
    }
    
    return id;
  };
  
  const valuationId = getValuationId();
  
  // Load condition values from localStorage if available
  const getConditionValues = () => {
    const storedValues = localStorage.getItem('condition_values');
    if (storedValues) {
      try {
        return JSON.parse(storedValues);
      } catch (e) {
        console.error('Error parsing stored condition values:', e);
      }
    }
    return null;
  };
  
  useEffect(() => {
    const fetchValuation = async () => {
      if (!valuationId) {
        setLoading(false);
        setNotFoundState(true);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('valuations')
          .select('*')
          .eq('id', valuationId)
          .single();
        
        if (error) {
          throw error;
        }
        
        if (!data) {
          setNotFoundState(true);
          setError('Valuation not found');
        } else {
          // Initialize adjustments array if it doesn't exist
          const processedData = {
            ...data,
            adjustments: []
          };
          
          // Apply condition values from localStorage if available
          const conditionValues = getConditionValues();
          if (conditionValues) {
            // Apply any condition adjustments to the valuation data
            processedData.adjustments.push(
              {
                factor: 'Mileage',
                impact: conditionValues.mileage * -100, // Example calculation
                description: `Adjusted for ${conditionValues.mileage === 0 ? 'low' : 'high'} mileage`
              },
              {
                factor: 'Accidents',
                impact: conditionValues.accidents * -250, // Example calculation
                description: `${conditionValues.accidents} accidents reported`
              }
            );
          }
          
          setValuation(processedData);
        }
      } catch (error: any) {
        console.error('Error fetching valuation:', error);
        setError(error.message);
        
        // If the valuation wasn't found, show NotFound
        if (error.code === 'PGRST116') {
          setNotFoundState(true);
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchValuation();
  }, [valuationId, navigate]);
  
  const handleDownloadPdf = async () => {
    if (!valuation) return;
    
    toast({
      title: "Generating PDF",
      description: "Your valuation report is being generated and will download shortly.",
    });
    
    try {
      const pdfData = {
        vehicleInfo: {
          make: valuation.make,
          model: valuation.model,
          year: valuation.year,
          vin: valuation.vin,
          mileage: valuation.mileage,
          condition: valuation.condition,
        },
        valuationDetails: {
          estimatedValue: valuation.estimated_value,
          basePrice: valuation.base_price,
          confidenceScore: valuation.confidence_score,
          adjustments: valuation.adjustments || [],
        },
        explanation: valuation.explanation,
      };
      
      await downloadPdf(pdfData);
      
      toast({
        title: "PDF Downloaded",
        description: "Your valuation report has been downloaded successfully.",
      });
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast({
        title: "Download Failed",
        description: "There was an error generating your PDF. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto py-12 px-4">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-8">
                <Skeleton className="h-12 w-3/4" />
                <Skeleton className="h-64 w-full" />
                <div className="grid grid-cols-2 gap-4">
                  <Skeleton className="h-24 w-full" />
                  <Skeleton className="h-24 w-full" />
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }
  
  // Only show NotFound component if we've explicitly determined this valuation doesn't exist
  if (notFoundState) {
    return <NotFound />;
  }
  
  // If we have a valuation, render the result
  if (valuation) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto py-8 px-4">
          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
            <div className="flex justify-between items-center mb-6">
              <TabsList>
                <TabsTrigger value="overview">Valuation Overview</TabsTrigger>
                <TabsTrigger value="details">Vehicle Details</TabsTrigger>
                {valuation.photos && valuation.photos.length > 0 && (
                  <TabsTrigger value="photos">Photos</TabsTrigger>
                )}
              </TabsList>
              
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleDownloadPdf}>
                  Download PDF
                </Button>
                <Button onClick={() => navigate('/free')}>
                  New Valuation
                </Button>
              </div>
            </div>
            
            <TabsContent value="overview" className="mt-0">
              <UnifiedValuationResult
                valuationId={valuationId!}
                displayMode="full"
                vehicleInfo={{
                  make: valuation.make,
                  model: valuation.model,
                  year: valuation.year,
                  trim: valuation.trim,
                  mileage: valuation.mileage,
                  condition: valuation.condition,
                  vin: valuation.vin
                }}
                estimatedValue={valuation.estimated_value}
                confidenceScore={valuation.confidence_score}
                priceRange={valuation.price_range}
                basePrice={valuation.base_price}
                adjustments={valuation.adjustments || []}
              />
            </TabsContent>
            
            <TabsContent value="details" className="mt-0">
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-2xl font-bold mb-4">Vehicle Details</h2>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                    <div>
                      <p className="text-sm text-gray-500">Make</p>
                      <p className="font-medium">{valuation.make}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Model</p>
                      <p className="font-medium">{valuation.model}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Year</p>
                      <p className="font-medium">{valuation.year}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Mileage</p>
                      <p className="font-medium">{valuation.mileage?.toLocaleString()} miles</p>
                    </div>
                    {valuation.vin && (
                      <div className="col-span-2">
                        <p className="text-sm text-gray-500">VIN</p>
                        <p className="font-medium font-mono">{valuation.vin}</p>
                      </div>
                    )}
                    {valuation.trim && (
                      <div>
                        <p className="text-sm text-gray-500">Trim</p>
                        <p className="font-medium">{valuation.trim}</p>
                      </div>
                    )}
                    {valuation.condition && (
                      <div>
                        <p className="text-sm text-gray-500">Condition</p>
                        <p className="font-medium capitalize">{valuation.condition}</p>
                      </div>
                    )}
                    {valuation.zip && (
                      <div>
                        <p className="text-sm text-gray-500">ZIP Code</p>
                        <p className="font-medium">{valuation.zip}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {valuation.photos && valuation.photos.length > 0 && (
              <TabsContent value="photos" className="mt-0">
                <Card>
                  <CardContent className="pt-6">
                    <h2 className="text-2xl font-bold mb-4">Vehicle Photos</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {valuation.photos.map((photo: string, index: number) => (
                        <div key={index} className="aspect-video bg-gray-100 rounded-md overflow-hidden">
                          <img 
                            src={photo} 
                            alt={`Vehicle photo ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>
        </main>
        <Footer />
      </div>
    );
  }
  
  // If we have an error but not the notFoundState, show an error message
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container max-w-md mx-auto py-20 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Error Loading Valuation</h1>
        <p className="text-muted-foreground mb-6">{error}</p>
        <Button onClick={() => navigate('/free')}>Start New Valuation</Button>
      </main>
      <Footer />
    </div>
  );
}
