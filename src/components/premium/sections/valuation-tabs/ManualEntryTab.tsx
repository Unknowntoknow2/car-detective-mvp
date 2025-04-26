
import { useState } from "react";
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
import { FileText, Car, Calendar, Gauge, MapPin } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ManualEntryFormData } from "@/components/lookup/types/manualEntry";

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
  zipCode: z.string().optional(),
  accident: z.enum(["yes", "no"]).optional(),
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
                            <SelectContent>
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
                            <SelectContent>
                              {selectedModels.map((model) => (
                                <SelectItem key={model.id} value={model.model_name}>
                                  {model.model_name}
                                </SelectItem>
                              ))}
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
                          <FormLabel className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            Year
                          </FormLabel>
                          <Select
                            onValueChange={(value) => field.onChange(parseInt(value))}
                            value={field.value.toString()}
                            disabled={isLoading}
                          >
                            <FormControl>
                              <SelectTrigger className="h-10">
                                <SelectValue placeholder="Select Year" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {getYearOptions().map((year) => (
                                <SelectItem key={year} value={year.toString()}>
                                  {year}
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
                        <p className="text-xs text-muted-foreground mt-1">For regional market comparison</p>
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
                              {conditionValue < 25 ? 'Vehicle has significant issues that affect functionality and appearance.' : 
                               conditionValue < 50 ? 'Vehicle has some wear and tear but runs reliably with minor issues.' :
                               conditionValue < 75 ? 'Vehicle is well-maintained with only minor cosmetic defects and regular service history.' :
                               'Vehicle is in exceptional condition with minimal wear and complete service records.'}
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
