
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useAuth } from '@/hooks/useAuth';
import { Loader2, Car, User, FileText, History } from 'lucide-react';

const DashboardPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { user, userDetails, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

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
    <div className="container mx-auto py-8">
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
                <div className="text-center py-10">
                  <FileText className="h-16 w-16 text-muted-foreground/60 mx-auto" />
                  <h3 className="mt-4 text-lg font-medium">No valuations yet</h3>
                  <p className="text-muted-foreground mt-2 mb-4">
                    Get started by creating your first vehicle valuation
                  </p>
                  <Button onClick={() => navigate('/valuation')}>
                    Get a Valuation
                  </Button>
                </div>
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
