
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, User, Building } from 'lucide-react';

export default function Dashboard() {
  const { user, userDetails, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/auth', { replace: true });
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const isDealer = userDetails?.role === 'dealer';
  const userName = userDetails?.full_name || user?.user_metadata?.full_name || user?.email || 'User';
  const dealerName = userDetails?.dealership_name || user?.user_metadata?.dealership_name || 'Your Dealership';

  if (isDealer) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
            <Building className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Dealer Dashboard</h1>
            <p className="text-muted-foreground">{dealerName}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">Manage your vehicle inventory</p>
              <Button className="w-full" onClick={() => navigate('/dealer/inventory')}>
                View Inventory
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Vehicle Valuations</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">Get professional vehicle valuations</p>
              <Button className="w-full" onClick={() => navigate('/valuation')}>
                New Valuation
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Leads & Offers</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">Manage customer leads and offers</p>
              <Button className="w-full" onClick={() => navigate('/dealer/leads')}>
                View Leads
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center gap-3 mb-8">
        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
          <User className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">My Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {userName}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Vehicle Valuation</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">Get an instant vehicle valuation</p>
            <Button className="w-full" onClick={() => navigate('/valuation')}>
              Start Valuation
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>VIN Lookup</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">Look up vehicle information by VIN</p>
            <Button variant="outline" className="w-full" onClick={() => navigate('/vin-lookup')}>
              VIN Lookup
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>My Account</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">Manage your account settings</p>
            <Button variant="outline" className="w-full" onClick={() => navigate('/profile')}>
              View Profile
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
