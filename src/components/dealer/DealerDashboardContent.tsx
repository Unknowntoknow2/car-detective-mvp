
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Building, Users, Car, FileText, ShoppingBag, ArrowUpRight, BarChart3 } from 'lucide-react';

const DealerDashboardContent = () => {
  const { userDetails } = useAuth();
  const [stats, setStats] = useState({
    leads: 0,
    inventory: 0,
    valuations: 0
  });

  const [activityData, setActivityData] = useState([
    { name: 'Mon', leads: 4 },
    { name: 'Tue', leads: 6 },
    { name: 'Wed', leads: 8 },
    { name: 'Thu', leads: 5 },
    { name: 'Fri', leads: 7 },
    { name: 'Sat', leads: 3 },
    { name: 'Sun', leads: 2 },
  ]);

  useEffect(() => {
    const fetchDealerStats = async () => {
      try {
        // This would be replaced with actual Supabase queries for dealer stats
        // For now, we'll just simulate loading with setTimeout
        setTimeout(() => {
          setStats({
            leads: 12,
            inventory: 24,
            valuations: 42
          });
        }, 800);
      } catch (error) {
        console.error('Error fetching dealer stats:', error);
      }
    };

    fetchDealerStats();
  }, []);

  return (
    <div className="container max-w-6xl mx-auto p-4 py-8">
      <div className="flex flex-col space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dealer Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome, {userDetails?.dealership_name || 'Dealer'}
            </p>
          </div>
          <div className="flex space-x-2">
            <Button asChild variant="outline">
              <Link to="/valuation">
                Valuate a Vehicle
              </Link>
            </Button>
            <Button asChild>
              <Link to="/dealer/inventory/add">
                Add Inventory
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">New Leads</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.leads}</div>
              <p className="text-xs text-muted-foreground">
                +9% from last week
              </p>
            </CardContent>
            <CardFooter className="p-2">
              <Link to="/dealer/leads" className="text-xs text-primary flex items-center">
                View all leads
                <ArrowUpRight className="ml-1 h-3 w-3" />
              </Link>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Inventory</CardTitle>
              <Car className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.inventory}</div>
              <p className="text-xs text-muted-foreground">
                {stats.inventory > 0 ? `${stats.inventory} vehicles in stock` : 'No vehicles in stock'}
              </p>
            </CardContent>
            <CardFooter className="p-2">
              <Link to="/dealer/inventory" className="text-xs text-primary flex items-center">
                Manage inventory
                <ArrowUpRight className="ml-1 h-3 w-3" />
              </Link>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Valuations</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.valuations}</div>
              <p className="text-xs text-muted-foreground">
                Lifetime valuation reports
              </p>
            </CardContent>
            <CardFooter className="p-2">
              <Link to="/dealer/valuations" className="text-xs text-primary flex items-center">
                View history
                <ArrowUpRight className="ml-1 h-3 w-3" />
              </Link>
            </CardFooter>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="activity" className="space-y-4">
          <TabsList>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="leads">Leads</TabsTrigger>
          </TabsList>
          
          <TabsContent value="activity" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Activity</CardTitle>
                <CardDescription>
                  Lead activity over the past week
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={activityData}
                      margin={{
                        top: 5,
                        right: 10,
                        left: 10,
                        bottom: 0,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="leads"
                        stroke="#2563eb"
                        strokeWidth={2}
                        dot={{ strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, strokeWidth: 0 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/dealer/reports">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    View Detailed Reports
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="inventory" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Inventory Overview</CardTitle>
                <CardDescription>
                  View and manage your vehicle inventory
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="text-center py-8">
                  <Car className="h-16 w-16 text-muted-foreground/60 mx-auto" />
                  <h3 className="mt-4 text-lg font-medium">
                    {stats.inventory > 0 
                      ? `You have ${stats.inventory} vehicles in your inventory` 
                      : 'No vehicles in inventory'}
                  </h3>
                  <p className="text-muted-foreground mt-2 mb-4">
                    {stats.inventory > 0 
                      ? 'View your inventory or add more vehicles' 
                      : 'Add your first vehicle to get started'}
                  </p>
                  <div className="flex flex-col sm:flex-row justify-center gap-3">
                    {stats.inventory > 0 && (
                      <Button variant="outline" asChild>
                        <Link to="/dealer/inventory">View Inventory</Link>
                      </Button>
                    )}
                    <Button asChild>
                      <Link to="/dealer/inventory/add">
                        <ShoppingBag className="mr-2 h-4 w-4" />
                        Add New Vehicle
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="leads" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Leads</CardTitle>
                <CardDescription>
                  Customer valuation requests that may lead to sales
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-10">
                  <Users className="h-16 w-16 text-muted-foreground/60 mx-auto" />
                  <h3 className="mt-4 text-lg font-medium">
                    {stats.leads > 0 
                      ? `You have ${stats.leads} active leads` 
                      : 'No leads yet'}
                  </h3>
                  <p className="text-muted-foreground mt-2 mb-4">
                    {stats.leads > 0 
                      ? 'Follow up with potential customers' 
                      : 'Leads will appear when customers request dealer offers'}
                  </p>
                  <Button asChild>
                    <Link to="/dealer/leads">
                      Manage Leads
                    </Link>
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

export default DealerDashboardContent;
