import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { BarChart3, Users, Car, Gauge, ArrowUpRight, Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { PremiumBadge } from './PremiumDealerBadge';
import { usePremiumDealer } from '@/hooks/usePremiumDealer';
import { toast } from 'sonner';

const DealerDashboardContent = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { isPremium, isLoading: isPremiumLoading } = usePremiumDealer();
  
  const [recentValuations, setRecentValuations] = useState([]);
  const [stats, setStats] = useState({
    totalLeads: 0,
    activeListings: 0,
    avgResponseTime: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  // Show toast on successful subscription
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const subscription = params.get('subscription');
    
    if (subscription === 'success') {
      toast.success('Subscription activated successfully!');
      // Clear the query params
      navigate('/dealer-dashboard', { replace: true });
    } else if (subscription === 'canceled') {
      toast.info('Subscription process canceled');
      // Clear the query params
      navigate('/dealer-dashboard', { replace: true });
    }
  }, [location, navigate]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        
        // Fetch recent valuations (example query)
        const { data: valuations, error: valuationsError } = await supabase
          .from('valuations')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);
          
        if (valuationsError) throw valuationsError;
        
        // Here you would fetch other dashboard data like leads, listings, etc.
        // This is placeholder data
        setRecentValuations(valuations || []);
        setStats({
          totalLeads: 12,
          activeListings: 35,
          avgResponseTime: 3.2
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [user]);

  if (!user) {
    return <div className="flex justify-center p-8">Please log in to view your dealer dashboard.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1">Dealer Dashboard</h1>
          <p className="text-muted-foreground">Manage your inventory, leads, and subscription</p>
        </div>
        <div className="flex items-center gap-3">
          {!isPremiumLoading && (
            isPremium ? (
              <PremiumBadge variant="gold" size="md" />
            ) : (
              <Button
                onClick={() => navigate('/dealer-subscription')}
                variant="default"
                className="flex items-center gap-2"
              >
                <Sparkles className="h-4 w-4" />
                Upgrade to Premium
              </Button>
            )
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{stats.totalLeads}</div>
              <Users className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Listings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{stats.activeListings}</div>
              <Car className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg Response Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{stats.avgResponseTime} hrs</div>
              <Gauge className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="leads">Recent Leads</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Dashboard Overview</CardTitle>
              <CardDescription>Your dealership at a glance</CardDescription>
            </CardHeader>
            <CardContent>
              {!isPremium ? (
                <div className="bg-muted p-4 rounded-md">
                  <h3 className="font-medium mb-2">Unlock Premium Features</h3>
                  <p className="text-sm mb-4">
                    Get access to advanced analytics, unlimited leads, and premium tools.
                  </p>
                  <Button
                    onClick={() => navigate('/dealer-subscription')}
                    size="sm"
                  >
                    View Pricing Plans
                  </Button>
                </div>
              ) : (
                <div className="bg-green-50 p-4 rounded-md">
                  <h3 className="font-medium text-green-700 mb-2">Premium Features Unlocked</h3>
                  <p className="text-sm text-green-600 mb-4">
                    Thank you for subscribing. You now have access to all premium dealer features.
                  </p>
                  <Button
                    onClick={() => navigate('/dealer-subscription')}
                    size="sm"
                    variant="outline"
                  >
                    Manage Subscription
                  </Button>
                </div>
              )}
              
              {/* Other overview content would go here */}
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <p>Loading activity...</p>
                ) : (
                  <p>Activity data would appear here</p>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Market Insights</CardTitle>
                {!isPremium && (
                  <Badge variant="outline" className="ml-2">
                    Premium
                  </Badge>
                )}
              </CardHeader>
              <CardContent>
                {isPremium ? (
                  <div>Market insights data would appear here</div>
                ) : (
                  <Button
                    onClick={() => navigate('/dealer-subscription')}
                    variant="outline"
                    size="sm"
                  >
                    Upgrade to See Insights
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="leads" className="space-y-4">
          {/* Leads content would go here */}
          <Card>
            <CardHeader>
              <CardTitle>Lead Management</CardTitle>
              <CardDescription>Track and respond to customer inquiries</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Lead management interface would appear here</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="inventory" className="space-y-4">
          {/* Inventory content would go here */}
          <Card>
            <CardHeader>
              <CardTitle>Inventory Management</CardTitle>
              <CardDescription>Manage your vehicle listings</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Inventory management interface would appear here</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DealerDashboardContent;
