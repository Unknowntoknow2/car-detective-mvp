import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LookupTabs } from './lookup/LookupTabs';
import { FeatureGrid } from './features/FeatureGrid';
import { SectionHeader } from '@/components/ui/design-system';
import { PremiumFields } from '@/components/lookup/form-parts/PremiumFields';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { AccidentDetails } from '@/components/lookup/types/manualEntry';
import { Shield, FileText, Car } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function PremiumValuationSection() {
  const navigate = useNavigate();
  const [lookup, setLookup] = useState<'vin' | 'plate' | 'manual'>('vin');
  const [make, setMake] = useState<string>('');
  const [model, setModel] = useState<string>('');
  const [year, setYear] = useState<string>('');
  const [mileage, setMileage] = useState<number>(0);
  const [fuel, setFuel] = useState<string>('');
  const [zip, setZip] = useState<string>('');
  const [condition, setCondition] = useState<number>(65);
  const [features, setFeatures] = useState<string[]>([]);
  const [accident, setAccident] = useState<'no' | 'yes'>('no');
  const [accidentDetails, setAccidentDetails] = useState<AccidentDetails>({
    count: '',
    severity: 'minor',
    area: 'front'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const featureList = [
    { id: 'heated', name: 'Heated Seats', impact: 100 },
    { id: 'vent', name: 'Ventilated Seats', impact: 150 },
    { id: 'power', name: 'Power Liftgate', impact: 200 },
    { id: 'remote', name: 'Remote Start', impact: 150 },
    { id: 'wireless', name: 'Wireless Charging', impact: 100 },
    { id: 'nav', name: 'Navigation System', impact: 300 },
    { id: 'audio', name: 'Premium Audio', impact: 250 },
    { id: 'leather', name: 'Leather Seats', impact: 200 },
    { id: 'sunroof', name: 'Sunroof', impact: 150 },
    { id: 'awd', name: 'All-Wheel Drive', impact: 800 },
    { id: 'sport', name: 'Sport Package', impact: 500 },
    { id: 'camera', name: '360-degree Camera', impact: 350 },
    { id: 'cruise', name: 'Adaptive Cruise Control', impact: 400 },
    { id: 'blind', name: 'Blind Spot Monitor', impact: 250 },
    { id: 'lane', name: 'Lane Departure Warning', impact: 300 },
  ];

  const handleFeatureToggle = (featureId: string) => {
    setFeatures(prev => 
      prev.includes(featureId) 
        ? prev.filter(x => x !== featureId)
        : [...prev, featureId]
    );
  };

  const handleSubmit = async () => {
    if (lookup === 'manual' && (!make || !model || !year)) {
      toast.error("Please enter required vehicle information");
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulating API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success("Premium valuation completed successfully!");
      navigate("/valuation/premium-123"); 
    } catch (error) {
      toast.error("Error processing valuation. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAccidentChange = (value: string) => {
    if (value === 'no' || value === 'yes') {
      setAccident(value);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <Badge variant="outline" className="bg-primary/5 text-primary mb-4">
              CARFAX® Report Included ($44 value)
            </Badge>
            <SectionHeader
              title="Premium Vehicle Valuation"
              description="Get the most accurate valuation with our professional-grade service, including CARFAX® report, dealer offers, and market analysis"
              size="lg"
              className="max-w-3xl mx-auto"
            />
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-6">
                <Shield className="h-8 w-8 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-2">CARFAX® Integration</h3>
                <p className="text-sm text-muted-foreground">
                  Complete vehicle history analysis for superior accuracy in valuations
                </p>
              </CardContent>
            </Card>
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-6">
                <FileText className="h-8 w-8 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-2">Market Analysis</h3>
                <p className="text-sm text-muted-foreground">
                  Future value projections based on historical market data
                </p>
              </CardContent>
            </Card>
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-6">
                <Car className="h-8 w-8 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-2">Dealer Network</h3>
                <p className="text-sm text-muted-foreground">
                  Compare prices across local dealers and get competitive offers
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="border-2 border-border/50 shadow-xl rounded-xl overflow-hidden">
            <CardHeader className="border-b bg-muted/30 px-6 py-8">
              <CardTitle className="text-2xl font-display">
                Start Your Premium Valuation
              </CardTitle>
            </CardHeader>

            <CardContent className="p-6 space-y-8">
              <LookupTabs
                lookup={lookup}
                onLookupChange={setLookup}
                formProps={{
                  make, setMake,
                  model, setModel,
                  year, setYear,
                  mileage, setMileage,
                  fuel, setFuel,
                  zip, setZip,
                  condition, setCondition,
                  accident, setAccident: handleAccidentChange
                }}
              />

              <div className="space-y-6 pt-4">
                <CardTitle className="text-xl">Vehicle Features</CardTitle>
                <FeatureGrid
                  features={features}
                  featureList={featureList}
                  onFeatureToggle={handleFeatureToggle}
                />
              </div>

              <div className="space-y-4 pt-4">
                <CardTitle className="text-xl">Accident History</CardTitle>
                <PremiumFields
                  accident={accident}
                  setAccident={handleAccidentChange}
                  accidentDetails={accidentDetails}
                  setAccidentDetails={setAccidentDetails}
                  isDisabled={false}
                />
              </div>

              <div className="flex justify-center pt-6">
                <Button 
                  size="lg"
                  className="w-full sm:w-auto min-w-[200px] bg-primary hover:bg-primary/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Processing..." : "Get Premium Valuation with CARFAX®"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export { PremiumValuationSection as default };
