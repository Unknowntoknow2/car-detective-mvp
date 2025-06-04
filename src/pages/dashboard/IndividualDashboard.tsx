<<<<<<< HEAD

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
=======
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";

export default function IndividualDashboard() {
  const { user } = useAuth();
  const firstName = user?.user_metadata?.full_name?.split(" ")[0] || "there";

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome, {firstName}!
          </h1>
          <p className="text-muted-foreground mt-2">
            View your saved valuations, profile, and vehicle insights.
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="valuations">Valuations</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Saved Valuations
                  </CardTitle>
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
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0</div>
                  <p className="text-xs text-muted-foreground">
                    No saved valuations yet
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Recent Activity
                  </CardTitle>
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
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <rect width="18" height="18" x="3" y="3" rx="2" ry="2">
                    </rect>
                    <line x1="3" x2="21" y1="9" y2="9"></line>
                    <path d="M8 2v4"></path>
                    <path d="M16 2v4"></path>
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">-</div>
                  <p className="text-xs text-muted-foreground">
                    No recent activity
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Account Status
                  </CardTitle>
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
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z">
                    </path>
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Active</div>
                  <p className="text-xs text-muted-foreground">
                    Individual Account
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-1">
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Getting Started</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4 rounded-lg border p-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                      1
                    </div>
                    <div>
                      <h4 className="font-semibold">
                        Get Your Vehicle Valuation
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Start a valuation to discover your vehicle's worth
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 rounded-lg border p-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                      2
                    </div>
                    <div>
                      <h4 className="font-semibold">Save Your Results</h4>
                      <p className="text-sm text-muted-foreground">
                        Save valuations to track your vehicle's value over time
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 rounded-lg border p-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                      3
                    </div>
                    <div>
                      <h4 className="font-semibold">
                        Explore Premium Features
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Upgrade to access detailed analytics and advanced
                        reports
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="valuations">
            <Card>
              <CardHeader>
                <CardTitle>Saved Valuations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-12 text-center">
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
                    className="h-12 w-12 text-muted-foreground mb-4"
                  >
                    <path d="M3 19h18"></path>
                    <path d="M5 6v.5A3.5 3.5 0 0 0 8.5 10H12"></path>
                    <path d="M19 19H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h3.93a2 2 0 0 1 1.66.9l.82 1.2a2 2 0 0 0 1.66.9H19a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2z">
                    </path>
                  </svg>
                  <h3 className="text-lg font-medium">No Valuations Yet</h3>
                  <p className="text-sm text-muted-foreground max-w-sm mx-auto mt-2">
                    Start by getting a valuation for your vehicle to see it
                    here.
                  </p>
                  <button className="mt-4 rounded-md bg-primary px-4 py-2 text-white hover:bg-primary/90">
                    New Valuation
                  </button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Email</label>
                      <div className="mt-1 rounded-md border px-3 py-2 bg-muted/50">
                        {user?.email || "Not available"}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Name</label>
                      <div className="mt-1 rounded-md border px-3 py-2 bg-muted/50">
                        {user?.user_metadata?.full_name || "Not set"}
                      </div>
                    </div>
                  </div>
                  <div>
                    <button className="rounded-md border px-4 py-2 text-sm font-medium">
                      Edit Profile
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
      </div>
    </div>
  );
};

export default IndividualDashboard;
