
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Plus, Car, Gauge, Users, DollarSign } from 'lucide-react';

const DealerDashboardContent: React.FC = () => {
  const { userDetails } = useAuth();
  const [inventoryCount, setInventoryCount] = useState(0);
  const [leadCount, setLeadCount] = useState(0);

  useEffect(() => {
    // In a real app, you would fetch these counts from an API
    // For now, we'll use mock data
    setInventoryCount(12);
    setLeadCount(5);
  }, []);

  return (
    <div className="container max-w-5xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dealer Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Manage your inventory and track customer leads
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button asChild>
            <Link to="/dealer/inventory/add">
              <Plus className="mr-2 h-4 w-4" /> Add Vehicle
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Inventory</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Car className="h-5 w-5 text-primary mr-2" />
              <span className="text-2xl font-bold">{inventoryCount}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Users className="h-5 w-5 text-primary mr-2" />
              <span className="text-2xl font-bold">{leadCount}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Gauge className="h-5 w-5 text-primary mr-2" />
              <span className="text-2xl font-bold">Good</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Dealership Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Dealership Name</p>
                <p className="font-medium">{userDetails?.dealership_name || 'Not set'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Contact Email</p>
                <p className="font-medium">{userDetails?.email || 'Not set'}</p>
              </div>
              <Button variant="outline" asChild>
                <Link to="/dealer/profile">Update Information</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-muted-foreground text-sm">
                No recent activity to display.
              </p>
              <div className="flex space-x-3">
                <Button variant="outline" asChild>
                  <Link to="/dealer/inventory">View Inventory</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/dealer/leads">View Leads</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DealerDashboardContent;
