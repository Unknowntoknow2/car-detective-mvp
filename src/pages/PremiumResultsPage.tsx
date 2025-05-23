
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Container } from '@/components/ui/container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, ArrowLeft, Download, Share, LineChart, Calendar, FileClock } from 'lucide-react';
import { TabNavigation } from '@/components/premium/sections/valuation-tabs/TabNavigation';
import { MarketAnalysisTab } from '@/components/premium/sections/valuation-tabs/MarketAnalysisTab';
import { ValuationServiceId } from '@/components/premium/sections/valuation-tabs/services';
import { toast } from 'sonner';

export default function PremiumResultsPage() {
  const { valuationId } = useParams<{ valuationId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [vehicle, setVehicle] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<ValuationServiceId>('market');
  
  useEffect(() => {
    const fetchValuation = async () => {
      setLoading(true);
      try {
        // Mock API call - in a real app, this would fetch data from your backend
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Mock vehicle data
        setVehicle({
          id: valuationId,
          make: 'Toyota',
          model: 'Camry',
          year: 2019,
          trim: 'XSE',
          mileage: 45000,
          condition: 'good',
          zipCode: '90210',
          estimatedValue: 22500,
          isPremium: true
        });
      } catch (error) {
        console.error('Error fetching valuation:', error);
        toast.error('Failed to load valuation data');
      } finally {
        setLoading(false);
      }
    };
    
    if (valuationId) {
      fetchValuation();
    }
  }, [valuationId]);
  
  const handleTabChange = (tab: ValuationServiceId) => {
    setActiveTab(tab);
  };
  
  const handleDownload = () => {
    toast.success('Downloading premium report...');
    // In a real app, this would trigger the download of a PDF
  };
  
  const handleShare = () => {
    navigator.clipboard.writeText(`https://yourapp.com/premium-results/${valuationId}`);
    toast.success('Link copied to clipboard');
  };
  
  if (loading) {
    return (
      <MainLayout>
        <Container className="py-16">
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-lg">Loading premium valuation results...</p>
          </div>
        </Container>
      </MainLayout>
    );
  }
  
  if (!vehicle) {
    return (
      <MainLayout>
        <Container className="py-16">
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">Valuation Not Found</h2>
                <p className="mb-8">The premium valuation you're looking for doesn't exist or has expired.</p>
                <Button onClick={() => navigate('/premium')}>
                  Get a New Valuation
                </Button>
              </div>
            </CardContent>
          </Card>
        </Container>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <Container className="py-8">
        <div className="mb-6">
          <Button variant="outline" onClick={() => navigate('/premium')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Premium
          </Button>
        </div>
        
        <Card className="mb-8">
          <CardHeader>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <CardTitle className="text-2xl md:text-3xl">
                  {vehicle.year} {vehicle.make} {vehicle.model} {vehicle.trim}
                </CardTitle>
                <p className="text-muted-foreground mt-1">Premium Valuation #{valuationId}</p>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleDownload}>
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF
                </Button>
                <Button variant="outline" onClick={handleShare}>
                  <Share className="mr-2 h-4 w-4" />
                  Share
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground">Estimated Value</p>
                  <h3 className="text-3xl font-bold">${vehicle.estimatedValue.toLocaleString()}</h3>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground">Condition</p>
                  <h3 className="text-xl font-semibold capitalize">{vehicle.condition}</h3>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground">Mileage</p>
                  <h3 className="text-xl font-semibold">{vehicle.mileage.toLocaleString()} mi</h3>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground">Location</p>
                  <h3 className="text-xl font-semibold">{vehicle.zipCode}</h3>
                </CardContent>
              </Card>
            </div>
            
            <Tabs defaultValue="market">
              <TabNavigation 
                activeTab={activeTab} 
                onTabChange={handleTabChange}
              />
              
              <div className="mt-6">
                <TabsContent value="market" className="mt-0">
                  <MarketAnalysisTab 
                    valuationId={valuationId}
                    isPremium={true}
                    zipCode={vehicle.zipCode}
                    make={vehicle.make}
                    model={vehicle.model}
                    year={vehicle.year}
                    vehicleData={vehicle}
                  />
                </TabsContent>
                
                <TabsContent value="forecast" className="mt-0">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Calendar className="mr-2 h-5 w-5" />
                        12-Month Value Forecast
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">
                        See how your {vehicle.year} {vehicle.make} {vehicle.model}'s value is predicted to change over the next 12 months.
                      </p>
                      <div className="h-[300px] flex items-center justify-center border rounded-md">
                        <LineChart className="h-12 w-12 text-muted-foreground" />
                        <p className="ml-4 text-muted-foreground">Forecast chart would appear here</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="carfax" className="mt-0">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <FileClock className="mr-2 h-5 w-5" />
                        CARFAX® Vehicle History Report
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">
                        Full vehicle history report for your {vehicle.year} {vehicle.make} {vehicle.model}.
                      </p>
                      <div className="h-[300px] flex items-center justify-center border rounded-md">
                        <p className="text-muted-foreground">CARFAX report would appear here</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {/* Add more tab contents for other services */}
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </Container>
    </MainLayout>
  );
}
