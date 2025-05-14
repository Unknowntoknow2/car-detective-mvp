import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { 
  Plus, 
  ListChecks, 
  CreditCard, 
  Loader2, 
  Car, 
  TrendingUp, 
  TrendingDown, 
  Users 
} from 'lucide-react';
import { supabase } from '@/utils/supabaseClient';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import DealerGuard from '@/guards/DealerGuard';
import { StatCard } from '@/components/stats/StatCard';
import { motion } from 'framer-motion';
import DealerInventoryStats from '@/components/dealer/DealerInventoryStats';

// Types for dealer profile and stats
interface DealerProfile {
  id: string;
  full_name?: string;
  dealership_name?: string;
  avatar_url?: string;
}

interface DealerStats {
  totalVehicles: number;
  activeVehicles: number;
  monthlyLeads: number;
  valuationsCompleted: number;
  averagePrice: number | null;
  lastAddedVehicle: {
    id: string;
    make: string;
    model: string;
    year: number;
    created_at: string;
  } | null;
  isLoading: boolean;
  error: string | null;
}

// Action Card component
const ActionCard: React.FC<{
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
}> = ({ title, description, icon, onClick }) => (
  <Card className="overflow-hidden hover:shadow-md transition-all duration-300 hover:scale-[1.02] cursor-pointer" onClick={onClick}>
    <CardHeader className="bg-primary/5 pb-2">
      <div className="flex items-center justify-between">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="rounded-full bg-primary/10 p-2 transition-transform hover:rotate-3">{icon}</div>
      </div>
    </CardHeader>
    <CardContent className="pt-4">
      <p className="text-xs text-muted-foreground">{description}</p>
    </CardContent>
    <CardFooter className="pt-0 pb-3">
      <Button variant="ghost" size="sm" className="ml-auto text-xs">
        View
      </Button>
    </CardFooter>
  </Card>
);

const DealerDashboardContent: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<DealerProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [stats, setStats] = useState<DealerStats>({
    totalVehicles: 0,
    activeVehicles: 0,
    monthlyLeads: 0,
    valuationsCompleted: 0,
    averagePrice: null,
    lastAddedVehicle: null,
    isLoading: true,
    error: null,
  });

  // Fetch dealer profile data
  useEffect(() => {
    const fetchDealerProfile = async () => {
      try {
        if (!user) return;

        const { data, error } = await supabase
          .from('profiles')
          .select('id, full_name, dealership_name, avatar_url')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        setProfile(data);
      } catch (error) {
        console.error('Error fetching dealer profile:', error);
      } finally {
        setProfileLoading(false);
      }
    };

    fetchDealerProfile();
  }, [user]);

  // Fetch dealer inventory stats
  useEffect(() => {
    const fetchDealerStats = async () => {
      try {
        if (!user) return;

        // Get total vehicles count
        const { count: totalVehicles, error: countError } = await supabase
          .from('dealer_vehicles')
          .select('*', { count: 'exact', head: true })
          .eq('dealer_id', user.id);

        if (countError) throw countError;
        
        // Get active vehicles count
        const { count: activeVehicles, error: activeError } = await supabase
          .from('dealer_vehicles')
          .select('*', { count: 'exact', head: true })
          .eq('dealer_id', user.id)
          .eq('status', 'available');
          
        if (activeError) throw activeError;
        
        // Get monthly leads count
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        
        const { count: monthlyLeads, error: leadsError } = await supabase
          .from('dealer_leads')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .gte('created_at', oneMonthAgo.toISOString());
          
        if (leadsError) throw leadsError;
        
        // Get valuations count
        const { count: valuationsCompleted, error: valuationsError } = await supabase
          .from('valuations')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);
          
        if (valuationsError) throw valuationsError;

        // Get average price
        const { data: priceData, error: priceError } = await supabase
          .from('dealer_vehicles')
          .select('price')
          .eq('dealer_id', user.id);

        if (priceError) throw priceError;

        const averagePrice = priceData.length
          ? priceData.reduce((acc, vehicle) => acc + (vehicle.price || 0), 0) / priceData.length
          : null;

        // Get last added vehicle
        const { data: lastVehicle, error: lastVehicleError } = await supabase
          .from('dealer_vehicles')
          .select('id, make, model, year, created_at')
          .eq('dealer_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        // Note: single() will throw if no results, so we handle that case
        const lastAddedVehicle = lastVehicleError ? null : lastVehicle;

        setStats({
          totalVehicles: totalVehicles || 0,
          activeVehicles: activeVehicles || 0,
          monthlyLeads: monthlyLeads || 0,
          valuationsCompleted: valuationsCompleted || 0,
          averagePrice,
          lastAddedVehicle,
          isLoading: false,
          error: null,
        });
      } catch (error: any) {
        console.error('Error fetching dealer stats:', error);
        setStats(prev => ({
          ...prev,
          isLoading: false,
          error: error.message || 'Failed to load dealer stats'
        }));
      }
    };

    fetchDealerStats();
  }, [user]);

  // Format currency
  const formatCurrency = (amount: number | null) => {
    if (amount === null) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Get dealer name for display
  const getDealerDisplayName = () => {
    if (profileLoading) return 'Loading...';
    if (!profile) return 'Dealer';
    return profile.dealership_name || profile.full_name || 'Dealer';
  };

  if (profileLoading || stats.isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl py-12">
      {/* Welcome Section */}
      <motion.div 
        className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, {getDealerDisplayName()}
          </h1>
          <p className="text-muted-foreground mt-1">
            Here's a quick look at your dealership activity
          </p>
          <p className="text-sm text-muted-foreground/70 mt-1">
            {format(new Date(), "EEEE, MMMM do, yyyy")}
          </p>
        </div>
        {profile?.avatar_url ? (
          <div className="mt-4 md:mt-0">
            <img 
              src={profile.avatar_url}
              alt={getDealerDisplayName()}
              className="w-12 h-12 rounded-full object-cover border border-border"
            />
          </div>
        ) : (
          <div className="mt-4 md:mt-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
            {getDealerDisplayName().charAt(0).toUpperCase()}
          </div>
        )}
      </motion.div>

      {/* KPI Section */}
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <StatCard 
          title="Total Listings" 
          value={stats.totalVehicles}
          icon={<ListChecks className="h-5 w-5" />}
          trend={{ value: 5, isPositive: true, label: "vs. last month" }}
        />
        <StatCard 
          title="Active Vehicles" 
          value={stats.activeVehicles}
          icon={<Car className="h-5 w-5" />}
          trend={{ value: 3, isPositive: true, label: "vs. last month" }}
        />
        <StatCard 
          title="Monthly Leads" 
          value={stats.monthlyLeads}
          icon={<Users className="h-5 w-5" />}
          trend={{ value: 2, isPositive: false, label: "vs. last month" }}
        />
        <StatCard 
          title="Valuations Completed" 
          value={stats.valuationsCompleted}
          icon={<TrendingUp className="h-5 w-5" />}
          trend={{ value: 8, isPositive: true, label: "vs. last month" }}
        />
      </motion.div>

      {/* Average Price and Last Added Vehicle */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <StatCard 
          title="Average Price" 
          value={stats.averagePrice || 0}
          formatter={formatCurrency}
          icon={<TrendingUp className="h-5 w-5" />}
        />
        <Card className="overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Last Added Vehicle
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            {stats.lastAddedVehicle ? (
              <div className="flex flex-col">
                <span className="text-xl font-semibold">
                  {stats.lastAddedVehicle.year} {stats.lastAddedVehicle.make} {stats.lastAddedVehicle.model}
                </span>
                <span className="text-xs text-muted-foreground mt-1">
                  {format(new Date(stats.lastAddedVehicle.created_at), "MMM d, yyyy")}
                </span>
              </div>
            ) : (
              <span className="text-muted-foreground text-sm">No vehicles added yet</span>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Inventory Stats Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <DealerInventoryStats />
      </motion.div>

      {/* Action Cards */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <ActionCard
            title="Add New Vehicle"
            description="List a new vehicle in your inventory"
            icon={<Plus className="h-5 w-5" />}
            onClick={() => navigate('/dealer/inventory/add')}
          />
          <ActionCard
            title="View Inventory"
            description="Manage your vehicle listings"
            icon={<ListChecks className="h-5 w-5" />}
            onClick={() => navigate('/dealer/inventory')}
          />
          <ActionCard
            title="Manage Subscription"
            description="View or update your dealer subscription"
            icon={<CreditCard className="h-5 w-5" />}
            onClick={() => navigate('/dealer-subscription')}
          />
        </div>
      </motion.div>
    </div>
  );
};

// Protected Dashboard with DealerGuard
const DealerDashboard: React.FC = () => {
  return (
    <DealerGuard>
      <DealerDashboardContent />
    </DealerGuard>
  );
};

export default DealerDashboard;
