<<<<<<< HEAD

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { calculateEnhancedValuation } from '@/utils/valuationCalculator';
import { ValuationParams, ValuationResult } from '@/utils/valuation/types';

// Component to demo the valuation calculator
export const ValuationCalculatorDemo: React.FC = () => {
  const [valuationParams, setValuationParams] = useState<ValuationParams>({
    zipCode: '90210',
    make: 'Toyota',
    model: 'Camry',
    year: 2020,
    mileage: 35000,
    condition: 'Good',
    baseMarketValue: 25000,
  });

  const [valuationResult, setValuationResult] = useState<ValuationResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setValuationParams((prev) => ({
      ...prev,
      [name]: name === 'mileage' || name === 'year' || name === 'baseMarketValue'
        ? parseInt(value, 10)
        : value,
    }));
  };

  const handleFeatureToggle = (feature: string) => {
    setValuationParams((prev) => {
      const currentFeatures = prev.features || [];
      const updatedFeatures = currentFeatures.includes(feature)
        ? currentFeatures.filter((f) => f !== feature)
        : [...currentFeatures, feature];

      return { ...prev, features: updatedFeatures };
    });
  };

  const calculateValuation = async () => {
    setIsCalculating(true);
    try {
      const result = await calculateEnhancedValuation(valuationParams);
      setValuationResult(result);
    } catch (error) {
      console.error('Error calculating valuation:', error);
    } finally {
      setIsCalculating(false);
    }
  };

  // Recalculate when params change
  useEffect(() => {
    // Only auto-calculate if all required fields are present
    if (valuationParams.make && valuationParams.model && valuationParams.year && 
        valuationParams.mileage && valuationParams.condition && valuationParams.zipCode) {
      const timer = setTimeout(() => {
        calculateValuation();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [valuationParams]);

  return (
    <div className="space-y-6 p-4 bg-card rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold">Valuation Calculator Demo</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Vehicle Information</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Make</label>
              <input
                type="text"
                name="make"
                value={valuationParams.make}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Model</label>
              <input
                type="text"
                name="model"
                value={valuationParams.model}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Year</label>
              <input
                type="number"
                name="year"
                value={valuationParams.year}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Mileage</label>
              <input
                type="number"
                name="mileage"
                value={valuationParams.mileage}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Condition</label>
              <select
                name="condition"
                value={valuationParams.condition}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              >
                <option value="Excellent">Excellent</option>
                <option value="Very Good">Very Good</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
                <option value="Poor">Poor</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">ZIP Code</label>
              <input
                type="text"
                name="zipCode"
                value={valuationParams.zipCode}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Base Market Value</label>
              <input
                type="number"
                name="baseMarketValue"
                value={valuationParams.baseMarketValue}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
          
          <div>
            <h4 className="text-md font-medium mb-2">Features</h4>
            <div className="flex flex-wrap gap-2">
              {['Leather Seats', 'Navigation System', 'Sunroof', 'Premium Audio', 'Backup Camera'].map((feature, index) => (
                <Button
                  key={index}
                  variant={valuationParams.features?.includes(feature) ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleFeatureToggle(feature)}
                >
                  {feature}
                </Button>
              ))}
            </div>
          </div>
          
          <Button 
            onClick={calculateValuation} 
            disabled={isCalculating}
            className="w-full"
          >
            {isCalculating ? 'Calculating...' : 'Calculate Valuation'}
          </Button>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Valuation Result</h3>
          
          {valuationResult ? (
            <div className="space-y-4">
              <div className="p-4 bg-primary/10 rounded-lg">
                <h4 className="text-xl font-bold text-primary">
                  ${(valuationResult.estimatedValue || 0).toLocaleString()}
                </h4>
                <p className="text-sm text-muted-foreground">
                  Estimated Value with {valuationResult.confidenceScore || 0}% confidence
                </p>
              </div>
              
              <div>
                <h4 className="text-md font-medium mb-2">Value Breakdown</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Base Value:</span>
                    <span>${(valuationResult.baseValue || 0).toLocaleString()}</span>
                  </div>
                  
                  {valuationResult.adjustments?.map((adjustment, index) => (
                    <div key={index} className="flex justify-between">
                      <span>{adjustment.factor}:</span>
                      <span className={adjustment.impact >= 0 ? 'text-green-600' : 'text-red-600'}>
                        {adjustment.impact >= 0 ? '+' : ''}{adjustment.impact.toLocaleString()}
                      </span>
=======
import React, { useState } from "react";
import {
  calculateFinalValuation,
  ValuationParams,
  ValuationResult,
} from "@/utils/valuationCalculator";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Car,
  ClipboardCheck,
  DollarSign,
  Gauge,
  MapPin,
  PlusCircle,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

const ValuationCalculatorDemo = () => {
  const [formData, setFormData] = useState<ValuationParams>({
    baseMarketValue: 25000,
    vehicleYear: 2019,
    make: "Toyota",
    model: "RAV4",
    mileage: 42000,
    condition: "Good",
    zipCode: "90210",
    features: ["Leather Seats", "Sunroof", "Navigation System"],
  });

  const [valuationResult, setValuationResult] = useState<
    ValuationResult | null
  >(null);
  const [loading, setLoading] = useState(false);
  const [newFeature, setNewFeature] = useState("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = e.target;

    // Handle numeric inputs
    if (
      name === "baseMarketValue" || name === "mileage" || name === "vehicleYear"
    ) {
      setFormData({
        ...formData,
        [name]: value ? Number(value) : undefined,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSelectChange = (
    name: string,
    value: string,
  ) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleAddFeature = () => {
    if (!newFeature.trim()) return;

    setFormData({
      ...formData,
      features: [...(formData.features || []), newFeature],
    });

    setNewFeature("");
  };

  const handleRemoveFeature = (index: number) => {
    const updatedFeatures = [...(formData.features || [])];
    updatedFeatures.splice(index, 1);

    setFormData({
      ...formData,
      features: updatedFeatures,
    });
  };

  const calculateValuation = () => {
    try {
      setLoading(true);

      // Simulate network delay for demonstration purposes
      setTimeout(() => {
        const result = calculateFinalValuation(formData);
        setValuationResult(result);
        setLoading(false);
        toast.success("Valuation calculated successfully!");
      }, 1000);
    } catch (error: any) {
      toast.error(`Valuation error: ${error.message}`);
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">
        Advanced Vehicle Valuation Calculator
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Vehicle Information</CardTitle>
            <CardDescription>
              Enter the details of the vehicle to calculate its market value
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="baseMarketValue">Base Market Value ($)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="baseMarketValue"
                    name="baseMarketValue"
                    className="pl-9"
                    type="number"
                    value={formData.baseMarketValue || ""}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="vehicleYear">Year</Label>
                  <Input
                    id="vehicleYear"
                    name="vehicleYear"
                    type="number"
                    value={formData.vehicleYear || ""}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <Label htmlFor="make">Make</Label>
                  <Input
                    id="make"
                    name="make"
                    value={formData.make || ""}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <Label htmlFor="model">Model</Label>
                  <Input
                    id="model"
                    name="model"
                    value={formData.model || ""}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="mileage">Mileage</Label>
                  <div className="relative">
                    <Gauge className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="mileage"
                      name="mileage"
                      type="number"
                      className="pl-9"
                      value={formData.mileage || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="condition">Condition</Label>
                  <Select
                    value={formData.condition || "Good"}
                    onValueChange={(value) =>
                      handleSelectChange("condition", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Excellent">Excellent</SelectItem>
                      <SelectItem value="Good">Good</SelectItem>
                      <SelectItem value="Fair">Fair</SelectItem>
                      <SelectItem value="Poor">Poor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="zipCode">ZIP Code</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="zipCode"
                    name="zipCode"
                    className="pl-9"
                    value={formData.zipCode || ""}
                    onChange={handleInputChange}
                    maxLength={5}
                  />
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <Label>Premium Features</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                {formData.features?.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-secondary/20 rounded-md p-2"
                  >
                    <span className="text-sm">{feature}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveFeature(index)}
                    >
                      <XCircle className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 mt-3">
                <Input
                  placeholder="Add a premium feature"
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddFeature()}
                />
                <Button onClick={handleAddFeature} size="icon">
                  <PlusCircle className="h-4 w-4" />
                </Button>
              </div>

              <p className="text-xs text-muted-foreground mt-2">
                Examples: Leather Seats, Sunroof, Navigation System, Premium
                Audio, etc.
              </p>
            </div>
          </CardContent>

          <CardFooter>
            <Button
              onClick={calculateValuation}
              className="w-full"
              disabled={loading || !formData.baseMarketValue}
            >
              {loading
                ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      >
                      </circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      >
                      </path>
                    </svg>
                    Calculating...
                  </span>
                )
                : (
                  <span className="flex items-center">
                    <Car className="mr-2 h-4 w-4" />
                    Calculate Valuation
                  </span>
                )}
            </Button>
          </CardFooter>
        </Card>

        {valuationResult && (
          <Card className="border-2 border-primary/20">
            <CardHeader className="bg-primary-light/10">
              <CardTitle className="flex justify-between items-center">
                <span>Valuation Result</span>
                <Badge variant="outline" className="bg-primary/10 text-primary">
                  {valuationResult.confidenceScore}% Confidence
                </Badge>
              </CardTitle>
              <CardDescription>
                {formData.vehicleYear} {formData.make} {formData.model}
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-6">
              <div className="text-center mb-6">
                <p className="text-sm text-muted-foreground">Estimated Value</p>
                <p className="text-3xl font-bold text-primary">
                  {formatCurrency(valuationResult.finalValue)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Range: {formatCurrency(valuationResult.finalValue * 0.97)} -
                  {" "}
                  {formatCurrency(valuationResult.finalValue * 1.03)}
                </p>
              </div>

              <Separator className="my-4" />

              <div>
                <div className="flex justify-between mb-2">
                  <h3 className="font-medium">Base Value</h3>
                  <span>{formatCurrency(valuationResult.baseValue)}</span>
                </div>

                <div className="space-y-3 mt-4">
                  <h3 className="font-medium">Adjustments</h3>

                  {valuationResult.adjustments.map((adjustment, index) => (
                    <div key={index} className="text-sm">
                      <div className="flex justify-between items-center">
                        <span>{adjustment.name}</span>
                        <span
                          className={adjustment.impact >= 0
                            ? "text-green-600"
                            : "text-red-600"}
                        >
                          {adjustment.impact >= 0 ? "+" : ""}
                          {formatCurrency(adjustment.impact)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {adjustment.description}
                      </p>
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
                    </div>
                  ))}
                  
                  <div className="flex justify-between font-bold border-t pt-2">
                    <span>Final Value:</span>
                    <span>${(valuationResult.finalValue || 0).toLocaleString()}</span>
                  </div>
                </div>
              </div>
<<<<<<< HEAD
              
              <div>
                <h4 className="text-md font-medium mb-2">Price Range</h4>
                <div className="flex justify-between">
                  <span>${((valuationResult.estimatedValue || 0) * 0.95).toLocaleString()}</span>
                  <span>to</span>
                  <span>${((valuationResult.estimatedValue || 0) * 1.05).toLocaleString()}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-muted rounded-lg text-center">
              <p className="text-muted-foreground">
                {isCalculating ? 'Calculating...' : 'Enter vehicle details to see valuation results'}
              </p>
            </div>
          )}
        </div>
=======
            </CardContent>

            <CardFooter className="flex-col gap-2">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  navigator.clipboard.writeText(
                    `${formData.vehicleYear} ${formData.make} ${formData.model} - Estimated Value: ${
                      formatCurrency(valuationResult.finalValue)
                    }`,
                  );
                  toast.success("Valuation copied to clipboard!");
                }}
              >
                <ClipboardCheck className="mr-2 h-4 w-4" />
                Copy Valuation
              </Button>
            </CardFooter>
          </Card>
        )}
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
      </div>
    </div>
  );
};

export default ValuationCalculatorDemo;
