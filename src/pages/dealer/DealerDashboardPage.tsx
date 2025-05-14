import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { usePremiumDealer } from '@/hooks/usePremiumDealer';
import { DealerVehicle } from '@/types/dealerVehicle';
import AddVehicleModal from '@/components/dealer/AddVehicleModal';
import { Sidebar } from '@/components/ui/sidebar';
import { toast } from 'sonner';
import {
  LayoutDashboard,
  ListOrdered,
  CreditCard,
  LogOut,
  Plus,
  Car,
  Users,
  BarChart3,
  Loader2,
  X
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Component to display dealer profile summary
const DealerProfile = ({ dealer }: { dealer: any }) => {
  return (
    <div className="flex items-center space-x-4 mb-6">
      <Avatar className="h-16 w-16 border-2 border-primary/20">
        <AvatarImage src={dealer?.avatar_url} alt={dealer?.dealership_name || 'Dealer'} />
        <AvatarFallback className="bg-primary-foreground text-primary text-lg">
          {dealer?.dealership_name?.substring(0, 2).toUpperCase() || 'D'}
        </AvatarFallback>
      </Avatar>
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          {dealer?.dealership_name || 'Welcome Back!'}
        </h1>
        <p className="text-muted-foreground">
          {dealer?.email || 'Dealer Dashboard'}
        </p>
      </div>
    </div>
  );
};

// Component to display subscription information
const SubscriptionCard = ({ isPremium, expiryDate }: { isPremium: boolean, expiryDate: string | null }) => {
  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Subscription Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <div>
            <Badge variant={isPremium ? "default" : "outline"} className={isPremium ? "bg-gradient-to-r from-indigo-600 to-purple-600" : ""}>
              {isPremium ? 'Premium' : 'Free'}
            </Badge>
            {isPremium && expiryDate && (
              <p className="text-sm text-muted-foreground mt-2">
                Valid until: {new Date(expiryDate).toLocaleDateString()}
              </p>
            )}
          </div>
          <Button variant="outline" size="sm" asChild>
            <a href="/dealer-subscription">Manage Subscription</a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Component to display inventory summary
const InventorySummary = ({ vehicles }: { vehicles: DealerVehicle[] }) => {
  const totalVehicles = vehicles.length;
  const availableVehicles = vehicles.filter(v => v.status === 'available').length;
  const pendingVehicles = vehicles.filter(v => v.status === 'pending').length;
  const soldVehicles = vehicles.filter(v => v.status === 'sold').length;
  
  const averagePrice = vehicles.length > 0 
    ? Math.round(vehicles.reduce((acc, vehicle) => acc + vehicle.price, 0) / vehicles.length) 
    : 0;

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Car className="h-5 w-5" />
          Inventory Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Total Vehicles</p>
            <p className="text-2xl font-bold">{totalVehicles}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Available</p>
            <p className="text-2xl font-bold">{availableVehicles}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Pending</p>
            <p className="text-2xl font-bold">{pendingVehicles}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Average Price</p>
            <p className="text-2xl font-bold">
              {averagePrice > 0 ? `$${averagePrice.toLocaleString()}` : 'N/A'}
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button variant="outline" asChild className="w-full">
          <a href="/dealer/inventory">View All Inventory</a>
        </Button>
      </CardFooter>
    </Card>
  );
};

// Component to display quick actions
const QuickActions = ({ onAddVehicle }: { onAddVehicle: () => void }) => {
  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button onClick={onAddVehicle} className="flex items-center gap-2">
            <Plus className="h-4 w-4" /> Add New Vehicle
          </Button>
          <Button variant="outline" className="flex items-center gap-2" asChild>
            <a href="/dealer/inventory">
              <ListOrdered className="h-4 w-4" /> Manage Inventory
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Component for future features (placeholders)
const FutureFeatures = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="h-5 w-5" /> Customer Leads
          </CardTitle>
          <CardDescription>Coming soon</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Connect with potential buyers interested in your vehicles. This feature is currently in development.
          </p>
        </CardContent>
      </Card>
      
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <BarChart3 className="h-5 w-5" /> Performance Insights
          </CardTitle>
          <CardDescription>Coming soon</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Get detailed analytics about your listings, views, and conversion rates.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

// Component for the mobile sidebar
const MobileSidebar = ({ onLogout }: { onLogout: () => Promise<void> }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <div className="md:hidden">
      <Button 
        variant="ghost" 
        className="mr-2" 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </Button>
      
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/50" onClick={() => setIsOpen(false)}>
          <div 
            className="fixed left-0 top-0 w-64 h-full bg-background p-4 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold">Dealer Dashboard</h2>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsOpen(false)}
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <nav className="space-y-2">
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => handleNavigation('/dealer')}
              >
                <LayoutDashboard className="mr-2 h-5 w-5" />
                Dashboard
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => handleNavigation('/dealer/inventory')}
              >
                <ListOrdered className="mr-2 h-5 w-5" />
                My Inventory
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => handleNavigation('/dealer-subscription')}
              >
                <CreditCard className="mr-2 h-5 w-5" />
                Subscription Plan
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={onLogout}
              >
                <LogOut className="mr-2 h-5 w-5" />
                Logout
              </Button>
            </nav>
          </div>
        </div>
      )}
    </div>
  );
};

// Main DealerDashboardPage component
const DealerDashboardPage = () => {
  const { user, userRole, signOut } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [vehicles, setVehicles] = useState<DealerVehicle[]>([]);
  const [dealerProfile, setDealerProfile] = useState<any>(null);
  const [isAddVehicleModalOpen, setIsAddVehicleModalOpen] = useState(false);
  const { isPremium, expiryDate } = usePremiumDealer();

  useEffect(() => {
    // Check if user is authenticated and has dealer role
    if (!user) {
      navigate('/auth/signin');
      return;
    }

    if (userRole && userRole !== 'dealer') {
      toast.error('Access denied. This page is for dealers only.');
      navigate('/');
      return;
    }

    // Fetch dealer profile and vehicles
    const fetchDealerData = async () => {
      try {
        setLoading(true);
        
        // Get dealer profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (profileError) {
          console.error('Error fetching dealer profile:', profileError);
        } else {
          setDealerProfile(profileData);
        }
        
        // Get dealer vehicles
        const { data: vehiclesData, error: vehiclesError } = await supabase
          .from('dealer_vehicles')
          .select('*')
          .eq('dealer_id', user.id)
          .order('created_at', { ascending: false });
          
        if (vehiclesError) {
          console.error('Error fetching dealer vehicles:', vehiclesError);
        } else {
          setVehicles(vehiclesData as DealerVehicle[]);
        }
      } catch (error) {
        console.error('Error in fetchDealerData:', error);
        toast.error('Failed to load dealer data.');
      } finally {
        setLoading(false);
      }
    };

    fetchDealerData();

    // Set up real-time subscription for vehicle updates
    const channel = supabase
      .channel('dealer_vehicles_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'dealer_vehicles',
        filter: `dealer_id=eq.${user.id}`
      }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setVehicles(prev => [payload.new as DealerVehicle, ...prev]);
        } else if (payload.eventType === 'UPDATE') {
          setVehicles(prev => 
            prev.map(vehicle => 
              vehicle.id === payload.new.id ? payload.new as DealerVehicle : vehicle
            )
          );
        } else if (payload.eventType === 'DELETE') {
          setVehicles(prev => 
            prev.filter(vehicle => vehicle.id !== payload.old.id)
          );
        }
      })
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, userRole, navigate]);

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/auth/signin');
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error('Failed to log out.');
    }
  };

  const handleVehicleAdded = () => {
    // This will be handled by the real-time subscription
    setIsAddVehicleModalOpen(false);
    toast.success('Vehicle added successfully!');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <h2 className="text-xl font-semibold">Loading Dashboard</h2>
          <p className="text-muted-foreground">Please wait while we load your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 border-r bg-card">
        <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4 mb-5">
            <h1 className="text-xl font-bold">Dealer Dashboard</h1>
          </div>
          <nav className="mt-5 flex-1 px-4 space-y-2">
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => navigate('/dealer')}
            >
              <LayoutDashboard className="mr-2 h-5 w-5" />
              Dashboard
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => navigate('/dealer/inventory')}
            >
              <ListOrdered className="mr-2 h-5 w-5" />
              My Inventory
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => navigate('/dealer-subscription')}
            >
              <CreditCard className="mr-2 h-5 w-5" />
              Subscription Plan
            </Button>
          </nav>
          <div className="px-4 mt-auto mb-4">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-5 w-5" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 md:pl-64">
        <div className="sticky top-0 z-10 bg-background border-b py-4 px-4 md:px-8 flex items-center justify-between">
          <MobileSidebar onLogout={handleLogout} />
          <h1 className="text-xl font-bold md:hidden">Dealer Dashboard</h1>
          <div className="flex items-center space-x-2">
            {isPremium && (
              <Badge variant="default" className="bg-gradient-to-r from-indigo-600 to-purple-600">
                Premium
              </Badge>
            )}
            <Avatar className="h-8 w-8">
              <AvatarFallback>
                {dealerProfile?.dealership_name?.substring(0, 2).toUpperCase() || 'D'}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        <div className="py-6 px-4 md:px-8">
          <DealerProfile dealer={dealerProfile} />
          
          <div className="grid grid-cols-1 gap-6">
            <SubscriptionCard isPremium={isPremium} expiryDate={expiryDate} />
            <InventorySummary vehicles={vehicles} />
            <QuickActions onAddVehicle={() => setIsAddVehicleModalOpen(true)} />
            <FutureFeatures />
          </div>
        </div>
      </div>

      {/* Add Vehicle Modal */}
      <AddVehicleModal 
        open={isAddVehicleModalOpen} 
        onOpenChange={setIsAddVehicleModalOpen}
        onVehicleAdded={handleVehicleAdded}
      />
    </div>
  );
};

export default DealerDashboardPage;
