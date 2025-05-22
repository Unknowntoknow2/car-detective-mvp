
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';
import { usePremiumCredits } from '@/hooks/usePremiumCredits';
import { Loader2, Car, User, FileText, History, Plus, CreditCard } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import ValuationHistoryList from '@/components/dashboard/ValuationHistoryList';

const DashboardPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { user, userDetails, isLoading: authLoading } = useAuth();
  const { credits, isLoading: creditsLoading } = usePremiumCredits();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const checkoutSuccess = searchParams.get('checkout_success') === 'true';

  useEffect(() => {
    // Set a short loading state for UI polish
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(loadingTimer);
  }, []);

  useEffect(() => {
    // If authentication has finished loading and there's no user, redirect to auth
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  if (authLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <h2 className="text-xl font-semibold mt-4">Loading dashboard...</h2>
          <p className="text-muted-foreground mt-1">Please wait</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {userDetails?.full_name || user?.email?.split('@')[0] || 'there'}!
            </p>
          </div>
          <Button onClick={() => navigate('/valuation')}>New Valuation</Button>
        </div>

        {checkoutSuccess && (
          <Alert className="bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800">
            <AlertTitle className="text-green-800 dark:text-green-400">Payment Successful</AlertTitle>
            <AlertDescription className="text-green-700 dark:text-green-500">
              Thank you for your purchase! Your premium credits have been added to your account.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Premium Credits</CardTitle>
            </CardHeader>
            <CardContent>
              {creditsLoading ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  <span>Loading credits...</span>
                </div>
              ) : (
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <CreditCard className="h-8 w-8 text-primary" />
                      <div>
                        <p className="text-2xl font-bold">{credits}</p>
                        <p className="text-sm text-muted-foreground">
                          Premium report credit{credits !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                    <Badge variant={credits > 0 ? "outline" : "secondary"}>
                      {credits > 0 ? 'Available' : 'None Available'}
                    </Badge>
                  </div>
                  <Button 
                    variant={credits > 0 ? "outline" : "default"} 
                    className="w-full"
                    onClick={() => navigate('/pricing')}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {credits > 0 ? 'Buy More Credits' : 'Get Premium Credits'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card className="md:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Button variant="outline" className="h-auto py-4 px-3 flex flex-col items-center justify-center space-y-2" onClick={() => navigate('/valuation')}>
                  <Car className="h-6 w-6" />
                  <div className="text-center">
                    <p className="font-medium">New Valuation</p>
                    <p className="text-xs text-muted-foreground">Value any vehicle</p>
                  </div>
                </Button>
                
                <Button variant="outline" className="h-auto py-4 px-3 flex flex-col items-center justify-center space-y-2" onClick={() => navigate('/valuation/history')}>
                  <History className="h-6 w-6" />
                  <div className="text-center">
                    <p className="font-medium">History</p>
                    <p className="text-xs text-muted-foreground">View past valuations</p>
                  </div>
                </Button>
                
                <Button variant="outline" className="h-auto py-4 px-3 flex flex-col items-center justify-center space-y-2" onClick={() => navigate('/profile')}>
                  <User className="h-6 w-6" />
                  <div className="text-center">
                    <p className="font-medium">Profile</p>
                    <p className="text-xs text-muted-foreground">Manage your account</p>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="valuations" className="space-y-4">
          <TabsList>
            <TabsTrigger value="valuations">My Valuations</TabsTrigger>
            <TabsTrigger value="vehicles">My Vehicles</TabsTrigger>
            <TabsTrigger value="history">Service History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="valuations" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Valuations</CardTitle>
              </CardHeader>
              <CardContent>
                <ValuationHistoryList limit={5} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="vehicles" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>My Vehicles</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-10">
                  <Car className="h-16 w-16 text-muted-foreground/60 mx-auto" />
                  <h3 className="mt-4 text-lg font-medium">No vehicles saved</h3>
                  <p className="text-muted-foreground mt-2 mb-4">
                    Add your vehicles to keep track of their value over time
                  </p>
                  <Button onClick={() => navigate('/vin-lookup')}>
                    Add a Vehicle
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Service History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-10">
                  <History className="h-16 w-16 text-muted-foreground/60 mx-auto" />
                  <h3 className="mt-4 text-lg font-medium">No service history</h3>
                  <p className="text-muted-foreground mt-2 mb-4">
                    Track your vehicle's service history to maintain its value
                  </p>
                  <Button onClick={() => navigate('/service-history')}>
                    Add Service Record
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DashboardPage;
