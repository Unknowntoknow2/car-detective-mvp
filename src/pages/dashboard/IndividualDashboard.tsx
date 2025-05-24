
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { WelcomeBanner } from '@/components/home/WelcomeBanner';

const IndividualDashboard = () => {
  const { user, userDetails } = useAuth();
  const navigate = useNavigate();
  const userName = userDetails?.full_name || user?.user_metadata?.full_name || user?.user_metadata?.name || 'User';
  
  // Redirect to auth if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  if (!user) {
    return null; // Will be redirected by the effect
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <WelcomeBanner />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Recent Valuations</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              You haven't created any valuations yet.
            </p>
            <Button 
              className="w-full" 
              onClick={() => navigate('/valuation')}
            >
              Get a Valuation
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Dealer Offers</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              No dealer offers yet. Create a valuation to receive offers.
            </p>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => navigate('/dealer-offers')}
            >
              View Offers
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>My Vehicles</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              No vehicles added to your account yet.
            </p>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => navigate('/my-vehicles')}
            >
              Add a Vehicle
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Dashboard Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-6 text-center border border-dashed rounded-lg">
                <h3 className="text-lg font-medium mb-2">Welcome, {userName}!</h3>
                <p className="text-muted-foreground mb-4">
                  Your personalized dashboard helps you track vehicle valuations, 
                  receive dealer offers, and manage your vehicles.
                </p>
                <Button onClick={() => navigate('/valuation')}>
                  Start Your First Valuation
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Account</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => navigate('/profile')}
              >
                Edit Profile
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => navigate('/settings')}
              >
                Settings
              </Button>
              {!userDetails?.dealership_name && (
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate('/dealer-signup')}
                >
                  Register as Dealer
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default IndividualDashboard;
