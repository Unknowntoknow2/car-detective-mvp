
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Plus, ListChecks, CreditCard, Loader2 } from 'lucide-react';
import { supabase } from '@/utils/supabaseClient';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import DealerGuard from '@/guards/DealerGuard';

// Types for dealer profile and stats
interface DealerProfile {
  id: string;
  full_name?: string;
  dealership_name?: string;
  avatar_url?: string;
}

interface DealerStats {
  totalVehicles: number;
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

// KPI Card component
const KPICard: React.FC<{
  title: string;
  value: string | number | React.ReactNode;
  description?: string;
}> = ({ title, value, description }) => (
  <Card className="overflow-hidden">
    <CardHeader className="bg-primary/5 pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
    </CardHeader>
    <CardContent className="pt-4">
      <div className="text-2xl font-bold">{value}</div>
      {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
    </CardContent>
  </Card>
);

// Action Card component
const ActionCard: React.FC<{
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
}> = ({ title, description, icon, onClick }) => (
  <Card className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer" onClick={onClick}>
    <CardHeader className="bg-primary/5 pb-2">
      <div className="flex items-center justify-between">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="rounded-full bg-primary/10 p-2">{icon}</div>
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, {getDealerDisplayName()}
          </h1>
          <p className="text-muted-foreground mt-1">
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
      </div>

      {/* KPI Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <KPICard 
          title="Total Vehicles" 
          value={stats.totalVehicles} 
          description="Active listings in your inventory"
        />
        <KPICard 
          title="Average Price" 
          value={formatCurrency(stats.averagePrice)} 
          description="Based on your current inventory"
        />
        <KPICard 
          title="Last Added Vehicle" 
          value={
            stats.lastAddedVehicle ? (
              <div className="flex flex-col">
                <span>{stats.lastAddedVehicle.year} {stats.lastAddedVehicle.make} {stats.lastAddedVehicle.model}</span>
                <span className="text-xs text-muted-foreground mt-1">
                  {format(new Date(stats.lastAddedVehicle.created_at), "MMM d, yyyy")}
                </span>
              </div>
            ) : (
              "No vehicles yet"
            )
          }
        />
      </div>

      {/* Action Cards */}
      <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
