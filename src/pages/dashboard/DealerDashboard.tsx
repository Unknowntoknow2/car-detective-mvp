<<<<<<< HEAD

import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { DealerHeader } from '@/components/dealer/DealerHeader';
import { DealerStats } from '@/components/dealer/DealerStats';
import { DealerValuationsList } from '@/components/dealer/DealerValuationsList';
import { DealerOffersTracker } from '@/components/dealer/DealerOffersTracker';
import { Button } from '@/components/ui/button';

const DealerDashboard = () => {
  const { user, userDetails } = useAuth();
  
  // Redirect if not a dealer
  if (userDetails?.role !== 'dealer') {
    return <Navigate to="/dashboard" replace />;
  }

  const dealerName = userDetails?.dealership_name || 
                    user?.user_metadata?.dealership_name || 
                    userDetails?.full_name || 
                    'Dealer';

  return (
    <div className="container mx-auto py-8 px-4">
      <DealerHeader dealerName={dealerName} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <DealerStats />
        </div>
        <div>
          <div className="bg-card rounded-lg shadow p-6 border h-full">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-4">
              <Button className="w-full">Add Vehicle</Button>
              <Button variant="outline" className="w-full">View Offers</Button>
              <Button variant="outline" className="w-full">Manage Leads</Button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DealerValuationsList />
        </div>
        <div>
          <DealerOffersTracker />
        </div>
=======
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import {
  CalendarClock,
  Car,
  ChevronRight,
  DollarSign,
  Users,
} from "lucide-react";

export default function DealerDashboard() {
  const { user } = useAuth();
  const dealerName = user?.user_metadata?.dealership_name ||
    user?.user_metadata?.full_name || "Dealer";

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {dealerName} Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your leads, vehicles, and dealer offers.
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="leads">Leads</TabsTrigger>
            <TabsTrigger value="offers">Offers</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Active Inventory
                  </CardTitle>
                  <Car className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0</div>
                  <p className="text-xs text-muted-foreground">
                    vehicles listed
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Active Leads
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0</div>
                  <p className="text-xs text-muted-foreground">
                    potential customers
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Offers Made
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0</div>
                  <p className="text-xs text-muted-foreground">
                    pending response
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Account Status
                  </CardTitle>
                  <CalendarClock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Active</div>
                  <p className="text-xs text-muted-foreground">
                    Dealer Account
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              <Card className="col-span-1 md:col-span-2 lg:col-span-2">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg border">
                    <div className="flex flex-col">
                      <div className="flex items-center justify-between p-4 border-b">
                        <div className="flex flex-col">
                          <p className="font-medium">
                            Welcome to your dealer dashboard
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Your account has been set up successfully
                          </p>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          Just now
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <button className="w-full flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50 transition-colors">
                      <span className="font-medium">Add Vehicle</span>
                      <ChevronRight className="h-4 w-4" />
                    </button>
                    <button className="w-full flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50 transition-colors">
                      <span className="font-medium">View Leads</span>
                      <ChevronRight className="h-4 w-4" />
                    </button>
                    <button className="w-full flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50 transition-colors">
                      <span className="font-medium">Create Offer</span>
                      <ChevronRight className="h-4 w-4" />
                    </button>
                    <button className="w-full flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50 transition-colors">
                      <span className="font-medium">Account Settings</span>
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="inventory">
            <Card>
              <CardHeader>
                <CardTitle>Vehicle Inventory</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Car className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No Vehicles Added Yet</h3>
                  <p className="text-sm text-muted-foreground max-w-sm mx-auto mt-2">
                    Start building your inventory by adding your first vehicle.
                  </p>
                  <button className="mt-4 rounded-md bg-primary px-4 py-2 text-white hover:bg-primary/90">
                    Add Vehicle
                  </button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="leads">
            <Card>
              <CardHeader>
                <CardTitle>Customer Leads</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Users className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No Leads Yet</h3>
                  <p className="text-sm text-muted-foreground max-w-sm mx-auto mt-2">
                    Leads will appear here when customers express interest in
                    your vehicles.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="offers">
            <Card>
              <CardHeader>
                <CardTitle>Dealer Offers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <DollarSign className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No Offers Made Yet</h3>
                  <p className="text-sm text-muted-foreground max-w-sm mx-auto mt-2">
                    Create and track offers to potential customers here.
                  </p>
                  <button className="mt-4 rounded-md bg-primary px-4 py-2 text-white hover:bg-primary/90">
                    Create Offer
                  </button>
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

export default DealerDashboard;
