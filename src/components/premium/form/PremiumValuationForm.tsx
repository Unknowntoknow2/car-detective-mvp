
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { CheckCircle2, Car, Wrench, Camera, FileText, Loader2 } from 'lucide-react';

export function PremiumValuationForm() {
  const [activeStep, setActiveStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: new Date().getFullYear().toString(),
    mileage: '',
    trim: '',
    bodyStyle: '',
    transmission: 'automatic',
    fuelType: 'gasoline',
    driveType: 'fwd',
    exteriorColor: '',
    interiorColor: '',
    vin: '',
    
    // Condition scores
    exteriorCondition: 7,
    interiorCondition: 7,
    mechanicalCondition: 7,
    
    // Accident history
    hasAccident: false,
    accidentSeverity: 'none',
    accidentDescription: '',
    
    // Features
    selectedFeatures: [] as string[],
    
    // Photos
    photos: [] as File[],
    
    // ZIP code
    zipCode: '',
    
    // Title status
    titleStatus: 'clean'
  });
  
  // Define the steps for the form
  const steps = [
    { id: 1, name: 'Vehicle Details' },
    { id: 2, name: 'Condition' },
    { id: 3, name: 'Accident History' },
    { id: 4, name: 'Features' },
    { id: 5, name: 'Photos' },
    { id: 6, name: 'Review' }
  ];
  
  // Features options for the form
  const featureOptions = [
    { id: 'leather', label: 'Leather Seats' },
    { id: 'sunroof', label: 'Sunroof/Moonroof' },
    { id: 'navigation', label: 'Navigation System' },
    { id: 'bluetooth', label: 'Bluetooth' },
    { id: 'thirdRow', label: 'Third Row Seat' },
    { id: 'backupCamera', label: 'Backup Camera' },
    { id: 'heatedSeats', label: 'Heated Seats' },
    { id: 'blindSpot', label: 'Blind Spot Monitoring' },
    { id: 'parkingSensors', label: 'Parking Sensors' },
    { id: 'premiumSound', label: 'Premium Sound System' },
    { id: 'remoteStart', label: 'Remote Start' },
    { id: 'adaptiveCruise', label: 'Adaptive Cruise Control' }
  ];
  
  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleFeatureToggle = (featureId: string) => {
    setFormData(prev => {
      const features = [...prev.selectedFeatures];
      if (features.includes(featureId)) {
        return { ...prev, selectedFeatures: features.filter(id => id !== featureId) };
      } else {
        return { ...prev, selectedFeatures: [...features, featureId] };
      }
    });
  };
  
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newPhotos = Array.from(e.target.files);
      setFormData(prev => ({ 
        ...prev, 
        photos: [...prev.photos, ...newPhotos]
      }));
    }
  };
  
  const removePhoto = (index: number) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };
  
  const nextStep = () => {
    if (activeStep < steps.length) {
      setActiveStep(activeStep + 1);
      window.scrollTo(0, 0);
    }
  };
  
  const prevStep = () => {
    if (activeStep > 1) {
      setActiveStep(activeStep - 1);
      window.scrollTo(0, 0);
    }
  };
  
  const handleSubmit = () => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      
      // Store valuation data
      localStorage.setItem('premium_valuation_data', JSON.stringify(formData));
      
      // Navigate to results
      navigate('/premium/results');
      
      toast.success('Premium valuation completed successfully!');
    }, 2000);
  };
  
  // Render the current step content
  const renderStepContent = () => {
    switch (activeStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="make">Make</Label>
                <Input
                  id="make"
                  value={formData.make}
                  onChange={(e) => handleChange('make', e.target.value)}
                  placeholder="e.g. Toyota"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="model">Model</Label>
                <Input
                  id="model"
                  value={formData.model}
                  onChange={(e) => handleChange('model', e.target.value)}
                  placeholder="e.g. Camry"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="year">Year</Label>
                <Select
                  value={formData.year}
                  onValueChange={(value) => handleChange('year', value)}
                >
                  <SelectTrigger id="year">
                    <SelectValue placeholder="Select Year" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i).map(year => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="mileage">Mileage</Label>
                <Input
                  id="mileage"
                  type="number"
                  value={formData.mileage}
                  onChange={(e) => handleChange('mileage', e.target.value)}
                  placeholder="e.g. 50000"
                  min="0"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="trim">Trim Level (Optional)</Label>
                <Input
                  id="trim"
                  value={formData.trim}
                  onChange={(e) => handleChange('trim', e.target.value)}
                  placeholder="e.g. XLE"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bodyStyle">Body Style</Label>
                <Select
                  value={formData.bodyStyle}
                  onValueChange={(value) => handleChange('bodyStyle', value)}
                >
                  <SelectTrigger id="bodyStyle">
                    <SelectValue placeholder="Select Body Style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sedan">Sedan</SelectItem>
                    <SelectItem value="suv">SUV</SelectItem>
                    <SelectItem value="truck">Truck</SelectItem>
                    <SelectItem value="coupe">Coupe</SelectItem>
                    <SelectItem value="convertible">Convertible</SelectItem>
                    <SelectItem value="wagon">Wagon</SelectItem>
                    <SelectItem value="van">Van/Minivan</SelectItem>
                    <SelectItem value="hatchback">Hatchback</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="transmission">Transmission</Label>
                <Select
                  value={formData.transmission}
                  onValueChange={(value) => handleChange('transmission', value)}
                >
                  <SelectTrigger id="transmission">
                    <SelectValue placeholder="Select Transmission" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="automatic">Automatic</SelectItem>
                    <SelectItem value="manual">Manual</SelectItem>
                    <SelectItem value="cvt">CVT</SelectItem>
                    <SelectItem value="dualClutch">Dual Clutch</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="fuelType">Fuel Type</Label>
                <Select
                  value={formData.fuelType}
                  onValueChange={(value) => handleChange('fuelType', value)}
                >
                  <SelectTrigger id="fuelType">
                    <SelectValue placeholder="Select Fuel Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gasoline">Gasoline</SelectItem>
                    <SelectItem value="diesel">Diesel</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                    <SelectItem value="electric">Electric</SelectItem>
                    <SelectItem value="plugin_hybrid">Plug-in Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="exteriorColor">Exterior Color</Label>
                <Input
                  id="exteriorColor"
                  value={formData.exteriorColor}
                  onChange={(e) => handleChange('exteriorColor', e.target.value)}
                  placeholder="e.g. Blue"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="interiorColor">Interior Color</Label>
                <Input
                  id="interiorColor"
                  value={formData.interiorColor}
                  onChange={(e) => handleChange('interiorColor', e.target.value)}
                  placeholder="e.g. Beige"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="vin">VIN (Optional)</Label>
              <Input
                id="vin"
                value={formData.vin}
                onChange={(e) => handleChange('vin', e.target.value.toUpperCase())}
                placeholder="e.g. 1HGCM82633A004352"
                maxLength={17}
              />
              <p className="text-xs text-muted-foreground">
                Enter your Vehicle Identification Number for the most accurate valuation
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="zipCode">ZIP Code</Label>
              <Input
                id="zipCode"
                value={formData.zipCode}
                onChange={(e) => handleChange('zipCode', e.target.value)}
                placeholder="e.g. 90210"
                maxLength={5}
                required
              />
            </div>
          </div>
        );
        
      case 2:
        return (
          <div className="space-y-6">
            <p className="text-muted-foreground">
              Rate the condition of your vehicle in each category. Move the slider to indicate the condition,
              where 1 is poor condition and 10 is excellent condition.
            </p>
            
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-8">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="exteriorCondition">Exterior Condition</Label>
                      <span className="text-sm font-medium">{formData.exteriorCondition}/10</span>
                    </div>
                    <Slider
                      id="exteriorCondition"
                      min={1}
                      max={10}
                      step={1}
                      value={[formData.exteriorCondition]}
                      onValueChange={(value) => handleChange('exteriorCondition', value[0])}
                    />
                    <p className="text-xs text-muted-foreground">
                      {formData.exteriorCondition <= 3 && "Poor: Significant damage, rust, dents, or paint issues."}
                      {formData.exteriorCondition > 3 && formData.exteriorCondition <= 6 && "Fair: Some visible wear and tear, minor dents or scratches."}
                      {formData.exteriorCondition > 6 && formData.exteriorCondition <= 8 && "Good: Limited visible wear, well-maintained."}
                      {formData.exteriorCondition > 8 && "Excellent: Nearly new condition, minimal or no visible flaws."}
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="interiorCondition">Interior Condition</Label>
                      <span className="text-sm font-medium">{formData.interiorCondition}/10</span>
                    </div>
                    <Slider
                      id="interiorCondition"
                      min={1}
                      max={10}
                      step={1}
                      value={[formData.interiorCondition]}
                      onValueChange={(value) => handleChange('interiorCondition', value[0])}
                    />
                    <p className="text-xs text-muted-foreground">
                      {formData.interiorCondition <= 3 && "Poor: Significant wear, tears, stains, or damage to interior components."}
                      {formData.interiorCondition > 3 && formData.interiorCondition <= 6 && "Fair: Some visible wear, minor stains or imperfections."}
                      {formData.interiorCondition > 6 && formData.interiorCondition <= 8 && "Good: Well-maintained, minimal wear."}
                      {formData.interiorCondition > 8 && "Excellent: Nearly new condition, clean and well-preserved."}
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="mechanicalCondition">Mechanical Condition</Label>
                      <span className="text-sm font-medium">{formData.mechanicalCondition}/10</span>
                    </div>
                    <Slider
                      id="mechanicalCondition"
                      min={1}
                      max={10}
                      step={1}
                      value={[formData.mechanicalCondition]}
                      onValueChange={(value) => handleChange('mechanicalCondition', value[0])}
                    />
                    <p className="text-xs text-muted-foreground">
                      {formData.mechanicalCondition <= 3 && "Poor: Significant mechanical issues, repairs needed."}
                      {formData.mechanicalCondition > 3 && formData.mechanicalCondition <= 6 && "Fair: Some mechanical wear, maintenance may be needed soon."}
                      {formData.mechanicalCondition > 6 && formData.mechanicalCondition <= 8 && "Good: Well-maintained, runs properly with minimal issues."}
                      {formData.mechanicalCondition > 8 && "Excellent: Performs like new, recently serviced, no issues."}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="space-y-2">
              <Label htmlFor="titleStatus">Title Status</Label>
              <Select
                value={formData.titleStatus}
                onValueChange={(value) => handleChange('titleStatus', value)}
              >
                <SelectTrigger id="titleStatus">
                  <SelectValue placeholder="Select Title Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="clean">Clean Title</SelectItem>
                  <SelectItem value="rebuilt">Rebuilt/Reconstructed</SelectItem>
                  <SelectItem value="salvage">Salvage</SelectItem>
                  <SelectItem value="lemon">Lemon Law/Manufacturer Buyback</SelectItem>
                  <SelectItem value="flood">Flood Damage</SelectItem>
                  <SelectItem value="junk">Junk/Dismantled</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Title status can significantly impact your vehicle's value
              </p>
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="space-y-6">
            <p className="text-muted-foreground">
              Please provide information about any accidents or damage history for your vehicle.
              Being honest about accident history helps provide the most accurate valuation.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="hasAccident"
                  checked={formData.hasAccident}
                  onCheckedChange={(checked) => handleChange('hasAccident', checked === true)}
                />
                <Label htmlFor="hasAccident">This vehicle has been in an accident</Label>
              </div>
              
              {formData.hasAccident && (
                <>
                  <div className="space-y-3 pt-4">
                    <Label>Accident Severity</Label>
                    <RadioGroup 
                      value={formData.accidentSeverity}
                      onValueChange={(value) => handleChange('accidentSeverity', value)}
                      className="space-y-3"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="minor" id="minor" />
                        <Label htmlFor="minor">Minor (Cosmetic damage only)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="moderate" id="moderate" />
                        <Label htmlFor="moderate">Moderate (Required some repairs)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="severe" id="severe" />
                        <Label htmlFor="severe">Severe (Significant damage/major repairs)</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <div className="space-y-2 pt-2">
                    <Label htmlFor="accidentDescription">Accident Description</Label>
                    <textarea
                      id="accidentDescription"
                      className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      rows={4}
                      value={formData.accidentDescription}
                      onChange={(e) => handleChange('accidentDescription', e.target.value)}
                      placeholder="Please describe the accident, when it occurred, and any repairs that were made."
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        );
        
      case 4:
        return (
          <div className="space-y-6">
            <p className="text-muted-foreground">
              Select all features that apply to your vehicle. Adding accurate feature information
              helps provide the most precise valuation.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {featureOptions.map(feature => (
                <div key={feature.id} className="flex items-center space-x-2 p-2 border rounded-md hover:bg-muted/50">
                  <Checkbox 
                    id={feature.id}
                    checked={formData.selectedFeatures.includes(feature.id)}
                    onCheckedChange={() => handleFeatureToggle(feature.id)}
                  />
                  <Label htmlFor={feature.id}>{feature.label}</Label>
                </div>
              ))}
            </div>
          </div>
        );
        
      case 5:
        return (
          <div className="space-y-6">
            <p className="text-muted-foreground">
              Upload photos of your vehicle to help us provide a more accurate valuation.
              We recommend uploading photos of the exterior (all sides), interior, and any damage.
            </p>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 place-items-center border-2 border-dashed rounded-md p-8 hover:bg-muted/50">
                <Camera className="h-10 w-10 text-muted-foreground mb-4" />
                <Label 
                  htmlFor="photoUpload" 
                  className="text-center cursor-pointer font-medium text-primary hover:underline"
                >
                  Click to upload photos
                </Label>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  Supports JPG, PNG, WEBP. Max 10MB per image.
                </p>
                <Input
                  id="photoUpload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  multiple
                  onChange={handlePhotoUpload}
                />
              </div>
              
              {formData.photos.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-medium mb-2">Uploaded Photos ({formData.photos.length})</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {formData.photos.map((photo, index) => (
                      <div key={index} className="relative rounded-md overflow-hidden border">
                        <img
                          src={URL.createObjectURL(photo)}
                          alt={`Vehicle photo ${index + 1}`}
                          className="w-full h-32 object-cover"
                        />
                        <button
                          type="button"
                          className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                          onClick={() => removePhoto(index)}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
        
      case 6:
        return (
          <div className="space-y-6">
            <p className="text-muted-foreground">
              Please review your information before submitting. Make sure all details are accurate
              for the most precise valuation.
            </p>
            
            <Tabs defaultValue="basics">
              <TabsList className="grid grid-cols-4 w-full">
                <TabsTrigger value="basics">Basics</TabsTrigger>
                <TabsTrigger value="condition">Condition</TabsTrigger>
                <TabsTrigger value="features">Features</TabsTrigger>
                <TabsTrigger value="photos">Photos</TabsTrigger>
              </TabsList>
              
              <TabsContent value="basics" className="mt-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Make</h4>
                        <p>{formData.make || 'Not provided'}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Model</h4>
                        <p>{formData.model || 'Not provided'}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Year</h4>
                        <p>{formData.year}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Mileage</h4>
                        <p>{formData.mileage ? `${parseInt(formData.mileage).toLocaleString()} miles` : 'Not provided'}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Trim</h4>
                        <p>{formData.trim || 'Not provided'}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Body Style</h4>
                        <p>{formData.bodyStyle || 'Not provided'}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Transmission</h4>
                        <p>{formData.transmission.charAt(0).toUpperCase() + formData.transmission.slice(1)}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Fuel Type</h4>
                        <p>{formData.fuelType.charAt(0).toUpperCase() + formData.fuelType.slice(1)}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">VIN</h4>
                        <p>{formData.vin || 'Not provided'}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">ZIP Code</h4>
                        <p>{formData.zipCode || 'Not provided'}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="condition" className="mt-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Exterior Condition</h4>
                        <div className="flex items-center mt-1">
                          <div className="w-full bg-muted rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full" 
                              style={{ width: `${(formData.exteriorCondition / 10) * 100}%` }}
                            ></div>
                          </div>
                          <span className="ml-2 text-sm font-medium">{formData.exteriorCondition}/10</span>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Interior Condition</h4>
                        <div className="flex items-center mt-1">
                          <div className="w-full bg-muted rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full" 
                              style={{ width: `${(formData.interiorCondition / 10) * 100}%` }}
                            ></div>
                          </div>
                          <span className="ml-2 text-sm font-medium">{formData.interiorCondition}/10</span>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Mechanical Condition</h4>
                        <div className="flex items-center mt-1">
                          <div className="w-full bg-muted rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full" 
                              style={{ width: `${(formData.mechanicalCondition / 10) * 100}%` }}
                            ></div>
                          </div>
                          <span className="ml-2 text-sm font-medium">{formData.mechanicalCondition}/10</span>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Title Status</h4>
                        <p>{formData.titleStatus.charAt(0).toUpperCase() + formData.titleStatus.slice(1)} Title</p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Accident History</h4>
                        {!formData.hasAccident ? (
                          <p>No accidents reported</p>
                        ) : (
                          <div>
                            <p>Accident Severity: {formData.accidentSeverity.charAt(0).toUpperCase() + formData.accidentSeverity.slice(1)}</p>
                            {formData.accidentDescription && (
                              <p className="text-sm mt-1">{formData.accidentDescription}</p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="features" className="mt-4">
                <Card>
                  <CardContent className="pt-6">
                    {formData.selectedFeatures.length === 0 ? (
                      <p>No additional features selected</p>
                    ) : (
                      <div className="grid grid-cols-2 gap-2">
                        {formData.selectedFeatures.map(featureId => {
                          const feature = featureOptions.find(f => f.id === featureId);
                          return (
                            <div key={featureId} className="flex items-center">
                              <CheckCircle2 className="h-4 w-4 text-primary mr-2" />
                              <span>{feature?.label}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="photos" className="mt-4">
                <Card>
                  <CardContent className="pt-6">
                    {formData.photos.length === 0 ? (
                      <p>No photos uploaded</p>
                    ) : (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {formData.photos.map((photo, index) => (
                          <img
                            key={index}
                            src={URL.createObjectURL(photo)}
                            alt={`Vehicle photo ${index + 1}`}
                            className="w-full h-32 object-cover rounded-md border"
                          />
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className="space-y-8">
      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Getting Started</span>
          <span>Complete</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all" 
            style={{ width: `${(activeStep / steps.length) * 100}%` }}
          ></div>
        </div>
      </div>
      
      {/* Steps */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
        {steps.map((step) => (
          <div
            key={step.id}
            className={`
              p-2 text-center text-xs border rounded-md cursor-pointer transition-colors
              ${activeStep === step.id ? 'border-primary bg-primary/10 text-primary font-medium' : 'border-muted-foreground/20 hover:bg-muted/50'}
            `}
            onClick={() => setActiveStep(step.id)}
          >
            {step.name}
          </div>
        ))}
      </div>
      
      {/* Step content */}
      <div className="py-4">
        {renderStepContent()}
      </div>
      
      {/* Navigation buttons */}
      <div className="flex justify-between pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={prevStep}
          disabled={activeStep === 1}
        >
          Back
        </Button>
        
        {activeStep < steps.length ? (
          <Button
            type="button"
            onClick={nextStep}
          >
            Continue
          </Button>
        ) : (
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-primary"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <FileText className="mr-2 h-4 w-4" />
                Submit Valuation
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
