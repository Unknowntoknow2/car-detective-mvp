
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import { Info, AlertCircle, Car, Fuel, Zap, Timer } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';

interface InventoryStats {
  totalVehicles: number;
  byCondition: {
    excellent: number;
    good: number;
    fair: number;
    poor: number;
  };
  byFuelType: {
    electric: number;
    gas: number;
    hybrid: number;
  };
  uploadedThisMonth: number;
  pendingReview: number;
}

type ChartData = {
  name: string;
  value: number;
  color: string;
}

const defaultStats: InventoryStats = {
  totalVehicles: 0,
  byCondition: {
    excellent: 0,
    good: 0,
    fair: 0,
    poor: 0
  },
  byFuelType: {
    electric: 0,
    gas: 0,
    hybrid: 0
  },
  uploadedThisMonth: 0,
  pendingReview: 0
};

const conditionColors = {
  excellent: "#4ade80", // green
  good: "#60a5fa", // blue
  fair: "#facc15", // yellow
  poor: "#f87171"  // red
};

const fuelTypeColors = {
  electric: "#818cf8", // indigo
  gas: "#94a3b8", // slate
  hybrid: "#2dd4bf"  // teal
};

export const DealerInventoryStats = () => {
  const [stats, setStats] = useState<InventoryStats>(defaultStats);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchInventoryStats = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        // Get current month's start date
        const currentDate = new Date();
        const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        
        // Fetch all vehicles for this dealer
        const { data: vehicles, error: vehiclesError } = await supabase
          .from('dealer_vehicles')
          .select('*')
          .eq('dealer_id', user.id);
          
        if (vehiclesError) throw vehiclesError;
        
        // Initialize the stats with the base structure
        const newStats: InventoryStats = {
          totalVehicles: vehicles ? vehicles.length : 0,
          byCondition: {
            excellent: 0,
            good: 0,
            fair: 0,
            poor: 0
          },
          byFuelType: {
            electric: 0,
            gas: 0,
            hybrid: 0
          },
          uploadedThisMonth: 0,
          pendingReview: 0
        };
        
        // Process vehicle data
        if (vehicles && vehicles.length > 0) {
          vehicles.forEach(vehicle => {
            // Count by condition
            if (vehicle.condition) {
              const condition = vehicle.condition.toLowerCase();
              if (condition === 'excellent') newStats.byCondition.excellent++;
              else if (condition === 'good') newStats.byCondition.good++;
              else if (condition === 'fair') newStats.byCondition.fair++;
              else if (condition === 'poor') newStats.byCondition.poor++;
            }
            
            // Count by fuel type
            if (vehicle.fuel_type) {
              const fuelType = vehicle.fuel_type.toLowerCase();
              if (fuelType === 'electric') newStats.byFuelType.electric++;
              else if (fuelType === 'gas' || fuelType === 'gasoline') newStats.byFuelType.gas++;
              else if (fuelType === 'hybrid') newStats.byFuelType.hybrid++;
            }
            
            // Count vehicles added this month
            const createdDate = new Date(vehicle.created_at);
            if (createdDate >= firstDayOfMonth) {
              newStats.uploadedThisMonth++;
            }
            
            // Count pending review (assuming status might be 'pending' or similar)
            if (vehicle.status === 'pending') {
              newStats.pendingReview++;
            }
          });
        }
        
        setStats(newStats);
      } catch (err: any) {
        console.error('Error fetching inventory stats:', err);
        setError(err.message || 'Failed to load inventory statistics');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchInventoryStats();
  }, [user]);

  // Prepare chart data
  const conditionChartData: ChartData[] = [
    { name: 'Excellent', value: stats.byCondition.excellent, color: conditionColors.excellent },
    { name: 'Good', value: stats.byCondition.good, color: conditionColors.good },
    { name: 'Fair', value: stats.byCondition.fair, color: conditionColors.fair },
    { name: 'Poor', value: stats.byCondition.poor, color: conditionColors.poor }
  ].filter(item => item.value > 0);

  const fuelTypeChartData: ChartData[] = [
    { name: 'Electric', value: stats.byFuelType.electric, color: fuelTypeColors.electric },
    { name: 'Gas', value: stats.byFuelType.gas, color: fuelTypeColors.gas },
    { name: 'Hybrid', value: stats.byFuelType.hybrid, color: fuelTypeColors.hybrid }
  ].filter(item => item.value > 0);

  if (error) {
    return (
      <Card className="bg-card/80 rounded-2xl shadow p-4">
        <div className="flex flex-col items-center justify-center p-6 text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mb-3" />
          <h3 className="text-lg font-semibold mb-2">Could not load inventory data</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Retry
          </button>
        </div>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {[1, 2, 3].map((item) => (
          <Card key={item} className="rounded-2xl bg-card/80 shadow overflow-hidden">
            <CardHeader className="pb-2">
              <Skeleton className="h-6 w-40" />
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <Skeleton className="h-14 w-20" />
                <Skeleton className="h-24 w-24 rounded-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Empty state when no vehicles exist
  if (stats.totalVehicles === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-muted/30 border border-border rounded-2xl p-8 text-center"
      >
        <Car className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-xl font-semibold mb-2">No vehicles in inventory</h3>
        <p className="text-muted-foreground mb-6">Add your first vehicle to see inventory stats and breakdowns</p>
        <button 
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          onClick={() => window.location.href = '/dealer/inventory/add'}
        >
          Add Your First Vehicle
        </button>
      </motion.div>
    );
  }

  return (
    <div className="my-8">
      <h2 className="text-xl font-semibold mb-5">Inventory Snapshot</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Condition Breakdown Card */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="h-full"
        >
          <Card className="rounded-2xl bg-card/80 shadow-sm hover:shadow-md transition-shadow h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                Vehicles by Condition
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs max-w-60">Breakdown of your inventory by condition category</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="text-2xl font-bold">{stats.totalVehicles}</div>
                  <div className="text-sm text-muted-foreground">Total Vehicles</div>
                  <ul className="mt-2 space-y-1 text-sm">
                    <li className="flex items-center">
                      <span className="w-3 h-3 inline-block mr-2 rounded-full" style={{ backgroundColor: conditionColors.excellent }}></span>
                      <span>Excellent: {stats.byCondition.excellent}</span>
                    </li>
                    <li className="flex items-center">
                      <span className="w-3 h-3 inline-block mr-2 rounded-full" style={{ backgroundColor: conditionColors.good }}></span>
                      <span>Good: {stats.byCondition.good}</span>
                    </li>
                    <li className="flex items-center">
                      <span className="w-3 h-3 inline-block mr-2 rounded-full" style={{ backgroundColor: conditionColors.fair }}></span>
                      <span>Fair: {stats.byCondition.fair}</span>
                    </li>
                    <li className="flex items-center">
                      <span className="w-3 h-3 inline-block mr-2 rounded-full" style={{ backgroundColor: conditionColors.poor }}></span>
                      <span>Poor: {stats.byCondition.poor}</span>
                    </li>
                  </ul>
                </div>
                <div className="h-32 w-32">
                  {conditionChartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={conditionChartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={25}
                          outerRadius={40}
                          paddingAngle={4}
                          dataKey="value"
                        >
                          {conditionChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                      <p className="text-xs text-muted-foreground">No condition data available</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Fuel Type Breakdown Card */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="h-full"
        >
          <Card className="rounded-2xl bg-card/80 shadow-sm hover:shadow-md transition-shadow h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                Vehicles by Fuel Type
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs max-w-60">Breakdown of your inventory by fuel type</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="text-2xl font-bold">{
                    stats.byFuelType.electric + stats.byFuelType.gas + stats.byFuelType.hybrid
                  }</div>
                  <div className="text-sm text-muted-foreground">With Fuel Type</div>
                  <ul className="mt-2 space-y-1 text-sm">
                    <li className="flex items-center">
                      <span className="w-3 h-3 inline-block mr-2 rounded-full" style={{ backgroundColor: fuelTypeColors.electric }}></span>
                      <span>Electric: {stats.byFuelType.electric}</span>
                    </li>
                    <li className="flex items-center">
                      <span className="w-3 h-3 inline-block mr-2 rounded-full" style={{ backgroundColor: fuelTypeColors.gas }}></span>
                      <span>Gas: {stats.byFuelType.gas}</span>
                    </li>
                    <li className="flex items-center">
                      <span className="w-3 h-3 inline-block mr-2 rounded-full" style={{ backgroundColor: fuelTypeColors.hybrid }}></span>
                      <span>Hybrid: {stats.byFuelType.hybrid}</span>
                    </li>
                  </ul>
                </div>
                <div className="h-32 w-32">
                  {fuelTypeChartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={fuelTypeChartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={25}
                          outerRadius={40}
                          paddingAngle={4}
                          dataKey="value"
                        >
                          {fuelTypeChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                      <p className="text-xs text-muted-foreground">No fuel type data available</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Activity Stats Card */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="h-full"
        >
          <Card className="rounded-2xl bg-card/80 shadow-sm hover:shadow-md transition-shadow h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                Recent Activity
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs max-w-60">Recent inventory activity and pending items</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <Timer className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{stats.uploadedThisMonth}</div>
                    <div className="text-sm text-muted-foreground">Added this month</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                    <AlertCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{stats.pendingReview}</div>
                    <div className="text-sm text-muted-foreground">Pending review</div>
                  </div>
                </div>

                <div className="pt-2">
                  <button 
                    className="w-full py-2 border border-border rounded-md text-sm hover:bg-muted transition-colors"
                    onClick={() => window.location.href = '/dealer/inventory'}
                  >
                    View All Inventory
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default DealerInventoryStats;
