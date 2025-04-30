
import { useState, useEffect } from 'react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UploadCloud, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface DrivingBehaviorInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function DrivingBehaviorInput({ value, onChange }: DrivingBehaviorInputProps) {
  const [sliderValue, setSliderValue] = useState(1);
  const [drivingProfiles, setDrivingProfiles] = useState<{
    profile: string;
    multiplier: number;
    description: string;
  }[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // Map slider value to profile
  const sliderToProfile = (val: number) => {
    if (val <= 0.33) return 'Conservative';
    if (val <= 0.66) return 'Normal';
    return 'Aggressive';
  };

  // Map profile to slider value
  const profileToSlider = (profile: string) => {
    switch (profile) {
      case 'Conservative': return 0;
      case 'Normal': return 0.5;
      case 'Aggressive': return 1;
      default: return 0.5;
    }
  };

  // Load driving profiles from database
  useEffect(() => {
    async function loadProfiles() {
      const { data, error } = await supabase
        .from('driving_profile')
        .select('*')
        .order('multiplier', { ascending: false });
        
      if (error) {
        console.error('Error loading driving profiles:', error);
        return;
      }
      
      if (data && data.length > 0) {
        setDrivingProfiles(data);
      }
    }
    
    loadProfiles();
  }, []);

  // Update slider value when value prop changes
  useEffect(() => {
    if (value) {
      setSliderValue(profileToSlider(value));
    }
  }, [value]);

  // Handle slider change
  const handleSliderChange = (newValue: number[]) => {
    const val = newValue[0];
    setSliderValue(val);
    const profile = sliderToProfile(val);
    onChange(profile);
  };

  // Handle file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsUploading(true);
    
    try {
      // In a real app, call an edge function to analyze the telematics data
      // For this example, we'll simulate processing and just pick a random profile
      
      // Simulate file upload and processing
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const drivingProfiles = ['Conservative', 'Normal', 'Aggressive'];
      const analyzedProfile = drivingProfiles[Math.floor(Math.random() * 3)];
      
      onChange(analyzedProfile);
      setSliderValue(profileToSlider(analyzedProfile));
      
      toast.success(`Driving data analyzed: ${analyzedProfile} driving pattern detected`);
    } catch (error) {
      console.error('Error processing driving data:', error);
      toast.error('Failed to process driving data');
    } finally {
      setIsUploading(false);
    }
  };

  // Get current profile details
  const currentProfile = drivingProfiles.find(p => p.profile === value) || {
    profile: 'Normal',
    multiplier: 1.0,
    description: 'Average driving behavior with typical vehicle wear patterns'
  };

  // Calculate the effect on price
  const priceEffect = (currentProfile.multiplier - 1) * 100;
  const priceEffectText = `${priceEffect > 0 ? '+' : ''}${priceEffect.toFixed(1)}%`;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Driving Behavior
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Info className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">
                  Your driving behavior affects vehicle value. Conservative driving may increase value,
                  while aggressive driving can reduce it due to increased wear and tear.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
        <CardDescription>
          Adjust the slider or upload telematics data
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Current Profile: <span className="font-medium">{value || 'Normal'}</span></Label>
              <Label>Effect on Price: <span className={`font-medium ${priceEffect >= 0 ? 'text-green-600' : 'text-red-600'}`}>{priceEffectText}</span></Label>
            </div>
            <Slider
              defaultValue={[0.5]}
              value={[sliderValue]} 
              onValueChange={handleSliderChange}
              max={1}
              step={0.01}
              className="my-4"
              trackClassName="bg-slate-200"
              rangeClassName={`${sliderValue <= 0.33 ? 'bg-green-500' : sliderValue <= 0.66 ? 'bg-blue-500' : 'bg-amber-500'}`}
            />
            <div className="flex justify-between text-sm">
              <span>Conservative</span>
              <span>Normal</span>
              <span>Aggressive</span>
            </div>
          </div>
          
          <div className="py-2 px-4 bg-slate-50 rounded-md text-sm">
            {currentProfile.description}
          </div>
          
          <div className="flex flex-col items-center space-y-2 border-2 border-dashed rounded-md p-4 border-slate-200">
            <UploadCloud className="h-8 w-8 text-slate-400" />
            <div className="text-center space-y-1">
              <p className="text-sm font-medium">Upload telematics data</p>
              <p className="text-xs text-slate-500">Upload CSV or JSON data from your vehicle's telematics system</p>
            </div>
            <div className="mt-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="relative"
                disabled={isUploading}
              >
                {isUploading ? 'Processing...' : 'Upload File'}
                <input
                  type="file"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  accept=".csv,.json"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
