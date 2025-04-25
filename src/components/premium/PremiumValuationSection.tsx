import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LookupTabs } from './lookup/LookupTabs';
import { FeatureGrid } from './features/FeatureGrid';
import { SectionHeader } from '@/components/ui/design-system';

export default function PremiumValuationSection() {
  const [lookup, setLookup] = useState<'vin' | 'plate' | 'manual'>('vin');
  const [make, setMake] = useState<string>('');
  const [model, setModel] = useState<string>('');
  const [year, setYear] = useState<string>('');
  const [mileage, setMileage] = useState<number>(0);
  const [fuel, setFuel] = useState<string>('');
  const [zip, setZip] = useState<string>('');
  const [condition, setCondition] = useState<number>(90);
  const [features, setFeatures] = useState<string[]>([]);
  const [accident, setAccident] = useState<'no' | 'yes'>('no');

  const featureList = [
    { id: 'heated', name: 'Heated Seats', impact: 100 },
    { id: 'vent', name: 'Ventilated Seats', impact: 150 },
    /* …more features… */
  ];

  const handleFeatureToggle = (featureId: string) => {
    setFeatures(prev => 
      prev.includes(featureId) 
        ? prev.filter(x => x !== featureId)
        : [...prev, featureId]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          {/* Header Section */}
          <div className="text-center space-y-4">
            <SectionHeader
              title="Premium Vehicle Valuation"
              description="Get the most accurate valuation with our professional-grade service"
              size="lg"
              className="max-w-3xl mx-auto"
            />
          </div>

          {/* Main Valuation Card */}
          <Card className="border-2 border-border/50 shadow-xl rounded-xl overflow-hidden">
            <CardHeader className="border-b bg-muted/30 px-6 py-8">
              <CardTitle className="text-2xl font-display">
                Start Your Premium Valuation
              </CardTitle>
            </CardHeader>

            <CardContent className="p-6 space-y-8">
              {/* Lookup Methods */}
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
                  accident, setAccident
                }}
              />

              {/* Features Section */}
              <div className="space-y-6 pt-4">
                <CardTitle className="text-xl">Premium Features</CardTitle>
                <FeatureGrid
                  features={features}
                  featureList={featureList}
                  onFeatureToggle={handleFeatureToggle}
                />
              </div>

              {/* CTA Section */}
              <div className="flex justify-center pt-6">
                <Button 
                  size="lg"
                  className="w-full sm:w-auto min-w-[200px] bg-primary hover:bg-primary/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  Get Premium Valuation with CARFAX
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
