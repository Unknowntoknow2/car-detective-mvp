
import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { VehicleDetailsInputs } from "@/components/lookup/form-parts/VehicleDetailsInputs";
import { useVehicleData } from "@/hooks/useVehicleData";
import { Check, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function PremiumValuationForm() {
  const [activeTab, setActiveTab] = useState("vehicle");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState<number | string>("");
  const [mileage, setMileage] = useState<number | string>("");
  const [condition, setCondition] = useState("good");
  const [fuelType, setFuelType] = useState("");
  const [transmission, setTransmission] = useState("");
  const [color, setColor] = useState("");
  const [zipCode, setZipCode] = useState("");
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const { getYearOptions } = useVehicleData();
  const yearOptions = getYearOptions(1990);
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!make) newErrors.make = "Make is required";
    if (!model) newErrors.model = "Model is required";
    if (!year) newErrors.year = "Year is required";
    if (!mileage) newErrors.mileage = "Mileage is required";
    if (!condition) newErrors.condition = "Condition is required";
    if (!fuelType) newErrors.fuelType = "Fuel type is required";
    if (!zipCode) newErrors.zipCode = "ZIP code is required";
    else if (!/^\d{5}(-\d{4})?$/.test(zipCode)) {
      newErrors.zipCode = "Enter a valid 5-digit ZIP code";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsSubmitted(true);
      toast.success("Valuation submitted successfully!");
    } catch (error) {
      console.error("Error submitting valuation:", error);
      toast.error("Failed to submit valuation");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="space-y-6">
      {!isSubmitted ? (
        <form onSubmit={handleSubmit}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="vehicle">Vehicle Details</TabsTrigger>
              <TabsTrigger value="condition">Condition & Features</TabsTrigger>
            </TabsList>
            
            <TabsContent value="vehicle" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label htmlFor="make" className="block text-sm font-medium">
                    Make
                  </label>
                  <Select value={make} onValueChange={setMake}>
                    <SelectTrigger id="make" className={errors.make ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select make" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="honda">Honda</SelectItem>
                      <SelectItem value="toyota">Toyota</SelectItem>
                      <SelectItem value="ford">Ford</SelectItem>
                      <SelectItem value="bmw">BMW</SelectItem>
                      <SelectItem value="audi">Audi</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.make && <p className="text-red-500 text-sm">{errors.make}</p>}
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="model" className="block text-sm font-medium">
                    Model
                  </label>
                  <Select value={model} onValueChange={setModel} disabled={!make}>
                    <SelectTrigger id="model" className={errors.model ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select model" />
                    </SelectTrigger>
                    <SelectContent>
                      {make === "honda" && (
                        <>
                          <SelectItem value="civic">Civic</SelectItem>
                          <SelectItem value="accord">Accord</SelectItem>
                          <SelectItem value="cr-v">CR-V</SelectItem>
                        </>
                      )}
                      {make === "toyota" && (
                        <>
                          <SelectItem value="camry">Camry</SelectItem>
                          <SelectItem value="corolla">Corolla</SelectItem>
                          <SelectItem value="rav4">RAV4</SelectItem>
                        </>
                      )}
                      {make === "ford" && (
                        <>
                          <SelectItem value="f-150">F-150</SelectItem>
                          <SelectItem value="escape">Escape</SelectItem>
                          <SelectItem value="mustang">Mustang</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                  {errors.model && <p className="text-red-500 text-sm">{errors.model}</p>}
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="year" className="block text-sm font-medium">
                    Year
                  </label>
                  <Select value={year.toString()} onValueChange={(value) => setYear(parseInt(value))}>
                    <SelectTrigger id="year" className={errors.year ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      {yearOptions.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.year && <p className="text-red-500 text-sm">{errors.year}</p>}
                </div>
              </div>
              
              <VehicleDetailsInputs
                mileage={mileage}
                setMileage={setMileage}
                condition={condition}
                setCondition={setCondition}
                fuelType={fuelType}
                setFuelType={setFuelType}
                transmission={transmission}
                setTransmission={setTransmission}
                color={color}
                setColor={setColor}
                errors={errors}
              />
              
              <div className="space-y-2">
                <label htmlFor="zipCode" className="block text-sm font-medium">
                  ZIP Code
                </label>
                <Input
                  id="zipCode"
                  placeholder="Enter ZIP code"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  className={errors.zipCode ? "border-red-500" : ""}
                />
                {errors.zipCode && <p className="text-red-500 text-sm">{errors.zipCode}</p>}
              </div>
              
              <div className="flex justify-end">
                <Button 
                  type="button" 
                  onClick={() => setActiveTab("condition")}
                >
                  Next: Condition & Features
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="condition" className="space-y-6">
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Vehicle Condition</h3>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Rate the condition of your vehicle in these categories:
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium">
                          Exterior Condition
                        </label>
                        <Select defaultValue="good">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="excellent">Excellent</SelectItem>
                            <SelectItem value="good">Good</SelectItem>
                            <SelectItem value="fair">Fair</SelectItem>
                            <SelectItem value="poor">Poor</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="block text-sm font-medium">
                          Interior Condition
                        </label>
                        <Select defaultValue="good">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="excellent">Excellent</SelectItem>
                            <SelectItem value="good">Good</SelectItem>
                            <SelectItem value="fair">Fair</SelectItem>
                            <SelectItem value="poor">Poor</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="block text-sm font-medium">
                          Mechanical Condition
                        </label>
                        <Select defaultValue="good">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="excellent">Excellent</SelectItem>
                            <SelectItem value="good">Good</SelectItem>
                            <SelectItem value="fair">Fair</SelectItem>
                            <SelectItem value="poor">Poor</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="block text-sm font-medium">
                          Tire Condition
                        </label>
                        <Select defaultValue="good">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="excellent">Excellent</SelectItem>
                            <SelectItem value="good">Good</SelectItem>
                            <SelectItem value="fair">Fair</SelectItem>
                            <SelectItem value="poor">Poor</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Vehicle Features</h3>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="leather" className="rounded" />
                      <label htmlFor="leather">Leather Seats</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="sunroof" className="rounded" />
                      <label htmlFor="sunroof">Sunroof/Moonroof</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="nav" className="rounded" />
                      <label htmlFor="nav">Navigation System</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="heated" className="rounded" />
                      <label htmlFor="heated">Heated Seats</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="premium" className="rounded" />
                      <label htmlFor="premium">Premium Audio</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="alloy" className="rounded" />
                      <label htmlFor="alloy">Alloy Wheels</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="backup" className="rounded" />
                      <label htmlFor="backup">Backup Camera</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="bluetooth" className="rounded" />
                      <label htmlFor="bluetooth">Bluetooth</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="thirdrow" className="rounded" />
                      <label htmlFor="thirdrow">Third Row Seating</label>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="flex justify-between">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setActiveTab("vehicle")}
                >
                  Back to Vehicle Details
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Valuation"
                  )}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </form>
      ) : (
        <div className="bg-green-50 p-6 rounded-lg border border-green-200">
          <div className="flex items-center text-green-700 mb-4">
            <Check className="h-6 w-6 mr-2" />
            <h3 className="text-lg font-medium">Valuation Submitted Successfully</h3>
          </div>
          <p className="mb-6">
            Thank you for submitting your vehicle information. Our experts are reviewing your details to provide you with the most accurate valuation.
          </p>
          <div className="bg-white p-4 rounded-md border border-gray-200 mb-4">
            <h4 className="font-medium mb-2">Vehicle Summary</h4>
            <div className="grid grid-cols-2 gap-y-2 text-sm">
              <div><span className="text-gray-500">Make:</span> {make}</div>
              <div><span className="text-gray-500">Model:</span> {model}</div>
              <div><span className="text-gray-500">Year:</span> {year}</div>
              <div><span className="text-gray-500">Mileage:</span> {mileage}</div>
              <div><span className="text-gray-500">Condition:</span> {condition}</div>
              <div><span className="text-gray-500">ZIP Code:</span> {zipCode}</div>
            </div>
          </div>
          <div className="flex justify-end">
            <Button variant="default" onClick={() => window.location.href = "/results"}>
              View Valuation Results
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
