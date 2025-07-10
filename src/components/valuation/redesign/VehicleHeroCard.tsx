import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Car, Fuel, MapPin, Clock, Zap, Gauge } from 'lucide-react';
import { motion } from 'framer-motion';

interface VehicleInfo {
  year: number;
  make: string;
  model: string;
  trim?: string;
  fuelType?: string;
  transmission?: string;
  mileage?: number;
  condition?: string;
  zipCode?: string;
}

interface VehicleHeroCardProps {
  vehicle: VehicleInfo;
  estimatedValue: number;
  confidenceScore: number;
  timestamp?: string;
  isPremium?: boolean;
}

export function VehicleHeroCard({
  vehicle,
  estimatedValue,
  confidenceScore,
  timestamp,
  isPremium = false
}: VehicleHeroCardProps) {
  // Add defensive checks
  if (!vehicle || !estimatedValue) {
    return (
      <Card className="h-48 flex items-center justify-center">
        <p className="text-muted-foreground">Loading vehicle information...</p>
      </Card>
    );
  }
  const getConfidenceLevel = (score: number) => {
    if (score >= 85) return { label: 'High Confidence', variant: 'default' as const, color: 'text-emerald-600' };
    if (score >= 70) return { label: 'Good Confidence', variant: 'secondary' as const, color: 'text-blue-600' };
    if (score >= 50) return { label: 'Moderate Confidence', variant: 'outline' as const, color: 'text-amber-600' };
    return { label: 'Low Confidence', variant: 'destructive' as const, color: 'text-red-600' };
  };

  const getFuelIcon = (fuelType?: string) => {
    if (fuelType?.toLowerCase().includes('electric') || fuelType?.toLowerCase().includes('ev')) {
      return <Zap className="w-4 h-4 text-green-600" />;
    }
    return <Fuel className="w-4 h-4 text-gray-600" />;
  };

  const confidence = getConfidenceLevel(confidenceScore);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="relative overflow-hidden bg-gradient-to-br from-background via-background/95 to-primary/5 border-2 border-primary/10 shadow-lg">
        {/* Premium indicator */}
        {isPremium && (
          <div className="absolute top-4 right-4 z-10">
            <Badge className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-medium">
              Premium
            </Badge>
          </div>
        )}

        <CardContent className="p-8">
          <div className="space-y-6">
            {/* Vehicle Identity */}
            <div className="space-y-2">
              <motion.h1 
                className="text-3xl md:text-4xl font-bold tracking-tight"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {vehicle.year} {vehicle.make}
              </motion.h1>
              <motion.div 
                className="flex items-center gap-3 text-xl md:text-2xl text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <span className="font-medium">{vehicle.model}</span>
                {vehicle.trim && (
                  <>
                    <span className="text-muted-foreground/60">•</span>
                    <span className="text-base">{vehicle.trim}</span>
                  </>
                )}
              </motion.div>
            </div>

            {/* Vehicle Details */}
            <motion.div 
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {vehicle.fuelType && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  {getFuelIcon(vehicle.fuelType)}
                  <span className="capitalize">{vehicle.fuelType}</span>
                </div>
              )}
              
              {vehicle.transmission && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Gauge className="w-4 h-4" />
                  <span>{vehicle.transmission}</span>
                </div>
              )}
              
              {vehicle.mileage && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Car className="w-4 h-4" />
                  <span>{vehicle.mileage.toLocaleString()} miles</span>
                </div>
              )}
              
              {vehicle.zipCode && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>ZIP {vehicle.zipCode}</span>
                </div>
              )}
            </motion.div>

            {/* Value and Confidence */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
              >
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Estimated Market Value</p>
                  <motion.p 
                    className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    ${estimatedValue.toLocaleString()}
                  </motion.p>
                </div>
              </motion.div>

              <motion.div 
                className="flex flex-col md:items-end gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <Badge variant={confidence.variant} className="w-fit">
                  <span className={confidence.color}>{confidence.label}</span>
                </Badge>
                
                {timestamp && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(timestamp).toLocaleString()}</span>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}