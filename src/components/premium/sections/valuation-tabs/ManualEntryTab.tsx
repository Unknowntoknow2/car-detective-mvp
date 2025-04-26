
import { useState, useEffect } from "react";
import { TabContentWrapper } from "./TabContentWrapper";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useVehicleData } from "@/hooks/useVehicleData";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { FileText, Car, Calendar, Gauge, MapPin, Info, CheckCircle2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { ManualEntryFormData } from "@/components/lookup/types/manualEntry";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { YearScroller } from "@/components/valuation/YearScroller";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ManualEntryTabProps {
  onSubmit: (data: ManualEntryFormData) => void;
  isLoading: boolean;
}

const manualEntrySchema = z.object({
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  year: z.number().min(1900, "Year must be at least 1900").max(new Date().getFullYear() + 1, "Year cannot be in the future"),
  mileage: z.number().min(0, "Mileage cannot be negative").max(1000000, "Mileage seems too high"),
  fuelType: z.string().min(1, "Fuel type is required"),
  condition: z.string().min(1, "Condition is required"),
  zipCode: z.string().regex(/^\d{5}$/, "ZIP code must be 5 digits").optional().or(z.literal('')),
  accident: z.enum(["yes", "no"]),
  accidentDetails: z.object({
    count: z.string().optional(),
    severity: z.string().optional(),
    area: z.string().optional(),
  }).optional(),
  selectedFeatures: z.array(z.string()).optional(),
});

export function ManualEntryTab({ onSubmit, isLoading }: ManualEntryTabProps) {
  const navigate = useNavigate();
  const { makes, getModelsByMake, getYearOptions } = useVehicleData();
  const [selectedMake, setSelectedMake] = useState<string>("");
  const [conditionValue, setConditionValue] = useState(50);
  const [selectedModels, setSelectedModels] = useState<any[]>([]);
  const [yearSelectionMethod, setYearSelectionMethod] = useState<'dropdown' | 'scroller'>('dropdown');
  
  const form = useForm<z.infer<typeof manualEntrySchema>>({
    resolver: zodResolver(manualEntrySchema),
    defaultValues: {
      make: "",
      model: "",
      year: new Date().getFullYear(),
      mileage: 0,
      fuelType: "gas",
      condition: "fair",
      zipCode: "",
      accident: "no",
      accidentDetails: {
        count: "",
        severity: "",
        area: ""
      },
      selectedFeatures: []
    }
  });

  // Handle vehicle make selection
  const handleMakeChange = (value: string) => {
    setSelectedMake(value);
    form.setValue("make", value);
    form.setValue("model", ""); // Reset model when make changes
    
    // Get models for the selected make
    const makesModels = getModelsByMake(value);
    setSelectedModels(makesModels);
  };

  // Get condition label from slider value
  const getConditionLabel = (value: number): string => {
    if (value <= 25) return "poor";
    if (value <= 50) return "fair";
    if (value <= 75) return "good";
    return "excellent";
  };

  // Update form condition value when slider changes
  const handleConditionChange = (values: number[]) => {
    const value = values[0];
    setConditionValue(value);
    form.setValue("condition", getConditionLabel(value));
  };

  const getConditionDescription = (value: number): string => {
    if (value <= 25) return 'Vehicle has significant issues that affect functionality and appearance.';
    if (value <= 50) return 'Vehicle has some wear and tear but runs reliably with minor issues.';
    if (value <= 75) return 'Vehicle is well-maintained with only minor cosmetic defects and regular service history.';
    return 'Vehicle is in exceptional condition with minimal wear and complete service records.';
  };

  const handleContinue = (data: z.infer<typeof manualEntrySchema>) => {
    // Save the vehicle details to local storage for the premium form
    localStorage.setItem("premium_vehicle", JSON.stringify({
      identifierType: 'manual',
      make: data.make,
      model: data.model,
      year: data.year,
      mileage: data.mileage,
      fuelType: data.fuelType,
      condition: data.condition,
      zipCode: data.zipCode,
      hasAccident: data.accident === "yes",
      accidentDetails: data.accident === "yes" ? data.accidentDetails : undefined
    }));
    
    toast.success("Vehicle information saved. Continuing to premium valuation.");
    navigate("/premium-valuation");
  };

  return (
    <TabContentWrapper
      title="Manual Vehicle Entry"
      description="Enter your vehicle details manually for a comprehensive valuation"
    >
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/30">
              <FileText className="h-3.5 w-3.5 mr-1" />
              Manual Entry
            </Badge>
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleContinue)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                {/* Make and Model Section */}
                <div className="space-y-6">
                  <div className="space-y-1">
                    <FormField
                      control={form.control}
                      name="make"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Car className="h-4 w-4" />
                            Make
                          </FormLabel>
                          <Select
                            onValueChange={handleMakeChange}
                            value={field.value}
                            disabled={isLoading}
                          >
                            <FormControl>
                              <SelectTrigger className="h-10">
                                <SelectValue placeholder="Select Make" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="max-h-[300px]">
                              {makes.map((make) => (
                                <SelectItem key={make.id} value={make.make_name}>
                                  {make.logo_url && (
                                    <img
                                      src={make.logo_url}
                                      alt={`${make.make_name} logo`}
                                      className="w-4 h-4 mr-2 inline-block"
                                    />
                                  )}
                                  {make.make_name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-1">
                    <FormField
                      control={form.control}
                      name="model"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Model</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                            disabled={!selectedMake || isLoading}
                          >
                            <FormControl>
                              <SelectTrigger className="h-10">
                                <SelectValue placeholder={selectedMake ? "Select Model" : "Select Make First"} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="max-h-[300px]">
                              {selectedModels.length > 0 ? (
                                selectedModels.map((model) => (
                                  <SelectItem key={model.id} value={model.model_name}>
                                    {model.model_name}
                                  </SelectItem>
                                ))
                              ) : selectedMake ? (
                                <SelectItem value="other" disabled>No models found for this make</SelectItem>
                              ) : null}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Year and Mileage Section */}
                <div className="space-y-6">
                  <div className="space-y-1">
                    <FormField
                      control={form.control}
                      name="year"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex justify-between items-center">
                            <FormLabel className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              Year
                            </FormLabel>
                            <Tabs
                              value={yearSelectionMethod}
                              onValueChange={(v: 'dropdown' | 'scroller') => setYearSelectionMethod(v)}
                              className="h-7"
                            >
                              <TabsList className="h-7 bg-muted/50">
                                <TabsTrigger value="dropdown" className="h-6 px-2 text-xs">Dropdown</TabsTrigger>
                                <TabsTrigger value="scroller" className="h-6 px-2 text-xs">Scroller</TabsTrigger>
                              </TabsList>
                            </Tabs>
                          </div>
                          <FormControl>
                            <div>
                              {yearSelectionMethod === 'dropdown' ? (
                                <Select
                                  onValueChange={(value) => field.onChange(parseInt(value))}
                                  value={field.value.toString()}
                                  disabled={isLoading}
                                >
                                  <SelectTrigger className="h-10">
                                    <SelectValue placeholder="Select Year" />
                                  </SelectTrigger>
                                  <SelectContent className="max-h-[300px]">
                                    {getYearOptions().map((year) => (
                                      <SelectItem key={year} value={year.toString()}>
                                        {year}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              ) : (
                                <YearScroller
                                  selectedYear={field.value}
                                  onYearChange={(year) => field.onChange(year)}
                                  startYear={1980}
                                  disabled={isLoading}
                                />
                              )}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-1">
                    <FormField
                      control={form.control}
                      name="mileage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Gauge className="h-4 w-4" />
                            Mileage
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min={0}
                              max={1000000}
                              placeholder="e.g. 45000"
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                              disabled={isLoading}
                              className="h-10"
                            />
                          </FormControl>
                          <FormDescription className="flex items-center text-xs">
                            <Info className="h-3 w-3 mr-1" /> 
                            Accurate mileage significantly impacts valuation
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Fuel Type */}
                <div className="space-y-1">
                  <FormField
                    control={form.control}
                    name="fuelType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fuel Type</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value} disabled={isLoading}>
                          <FormControl>
                            <SelectTrigger className="h-10">
                              <SelectValue placeholder="Select Fuel Type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="gas">Gasoline</SelectItem>
                            <SelectItem value="diesel">Diesel</SelectItem>
                            <SelectItem value="hybrid">Hybrid</SelectItem>
                            <SelectItem value="electric">Electric</SelectItem>
                            <SelectItem value="plugin_hybrid">Plug-in Hybrid</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* ZIP Code */}
                <div className="space-y-1">
                  <FormField
                    control={form.control}
                    name="zipCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          ZIP Code
                        </FormLabel>
                        <FormControl>
                          <Input
                            maxLength={5}
                            placeholder="e.g. 90210"
                            {...field}
                            onChange={(e) => field.onChange(e.target.value.replace(/\D/g, '').slice(0, 5))}
                            disabled={isLoading}
                            className="h-10"
                          />
                        </FormControl>
                        <FormDescription className="flex items-center text-xs">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="h-3 w-3 mr-1 cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent className="w-80 p-3">
                                <p>ZIP code helps us analyze your local market conditions, including:</p>
                                <ul className="list-disc list-inside mt-1 text-xs">
                                  <li>Regional demand for your specific vehicle</li>
                                  <li>Local dealer pricing trends</li>
                                  <li>Seasonal market fluctuations in your area</li>
                                </ul>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          For regional market comparison (optional)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Condition Slider */}
              <div className="space-y-3 pt-4 border-t border-gray-100">
                <FormField
                  control={form.control}
                  name="condition"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vehicle Condition</FormLabel>
                      <FormControl>
                        <div className="space-y-2">
                          <Slider
                            value={[conditionValue]}
                            max={100}
                            step={1}
                            onValueChange={handleConditionChange}
                            disabled={isLoading}
                            className="my-4"
                          />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Poor</span><span>Fair</span><span>Good</span><span>Excellent</span>
                          </div>
                          <div className="mt-2 p-3 bg-muted/30 rounded-md text-sm">
                            <p className="font-medium">Current: {getConditionLabel(conditionValue)}</p>
                            <p className="text-xs mt-1">
                              {getConditionDescription(conditionValue)}
                            </p>
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Accident History */}
              <div className="space-y-3 pt-4 border-t border-gray-100">
                <FormField
                  control={form.control}
                  name="accident"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Accident History</FormLabel>
                      <FormControl>
                        <RadioGroup 
                          onValueChange={field.onChange} 
                          value={field.value} 
                          className="flex space-x-4 mt-2"
                          disabled={isLoading}
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="no" id="acc-no" />
                            <Label htmlFor="acc-no" className="font-normal">No</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="yes" id="acc-yes" />
                            <Label htmlFor="acc-yes" className="font-normal">Yes</Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {form.watch('accident') === 'yes' && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pl-6 border-l-2 border-primary/20">
                    <FormField
                      control={form.control}
                      name="accidentDetails.count"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Number of Accidents</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value} disabled={isLoading}>
                            <FormControl>
                              <SelectTrigger className="h-10">
                                <SelectValue placeholder="Select count" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="1">1</SelectItem>
                              <SelectItem value="2">2</SelectItem>
                              <SelectItem value="3">3</SelectItem>
                              <SelectItem value="4+">4 or more</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="accidentDetails.severity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Severity</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value} disabled={isLoading}>
                            <FormControl>
                              <SelectTrigger className="h-10">
                                <SelectValue placeholder="Select severity" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="minor">Minor</SelectItem>
                              <SelectItem value="moderate">Moderate</SelectItem>
                              <SelectItem value="severe">Severe</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="accidentDetails.area"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Affected Area</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value} disabled={isLoading}>
                            <FormControl>
                              <SelectTrigger className="h-10">
                                <SelectValue placeholder="Select area" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="front">Front</SelectItem>
                              <SelectItem value="rear">Rear</SelectItem>
                              <SelectItem value="side">Side</SelectItem>
                              <SelectItem value="multiple">Multiple Areas</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-gray-100">
                <div className="bg-gray-50 p-4 rounded-lg mb-4 flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-sm">Premium Valuation Includes:</h4>
                    <ul className="text-xs text-muted-foreground mt-1 space-y-1">
                      <li>• Professional-grade valuation with market analysis</li>
                      <li>• CARFAX® Report ($44 value)</li>
                      <li>• 12-month value forecast with seasonal trends</li>
                      <li>• Local dealer offers in your area</li>
                    </ul>
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full md:w-auto bg-primary" 
                  disabled={isLoading || !form.formState.isValid}
                >
                  {isLoading ? "Processing..." : "Continue to Valuation"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </TabContentWrapper>
  );
}
