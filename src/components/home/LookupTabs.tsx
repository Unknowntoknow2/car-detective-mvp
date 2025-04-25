import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { VinDecoderForm } from "../lookup/VinDecoderForm";
import { Link } from "react-router-dom";
import { AccidentHistoryInput } from '../valuation/AccidentHistoryInput';
import { ConditionSliderWithTooltip } from '../valuation/ConditionSliderWithTooltip';
import { ManualEntryForm } from '../lookup/ManualEntryForm';
import { PlateDecoderForm } from '../lookup/PlateDecoderForm';
import { useState } from "react";
import { CarFront, Search, FileText, Check } from "lucide-react";

export function LookupTabs() {
  const [conditionValue, setConditionValue] = useState(75);
  const [hasAccidents, setHasAccidents] = useState('no');
  const [accidentCount, setAccidentCount] = useState('');
  const [accidentSeverity, setAccidentSeverity] = useState('');

  return (
    <Tabs defaultValue="vin" className="max-w-4xl mx-auto">
      <TabsList className="grid w-full grid-cols-3 h-auto p-1 rounded-lg">
        <TabsTrigger 
          value="vin" 
          className="py-4 px-2 rounded-md data-[state=active]:bg-primary data-[state=active]:text-white z-10"
        >
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <CarFront className="w-5 h-5" />
            <span>VIN Lookup</span>
          </div>
        </TabsTrigger>
        
        <TabsTrigger 
          value="plate" 
          className="py-4 px-2 rounded-md data-[state=active]:bg-primary data-[state=active]:text-white z-10"
        >
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <Search className="w-5 h-5" />
            <span>Plate Lookup</span>
          </div>
        </TabsTrigger>
        
        <TabsTrigger 
          value="manual" 
          className="py-4 px-2 rounded-md data-[state=active]:bg-primary data-[state=active]:text-white z-10"
        >
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <FileText className="w-5 h-5" />
            <span>Manual Entry</span>
          </div>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="vin" className="mt-6 z-0">
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle>VIN Lookup</CardTitle>
            <CardDescription>Enter your Vehicle Identification Number for a detailed analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <VinDecoderForm />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="plate" className="mt-6 z-0">
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle>License Plate Lookup</CardTitle>
            <CardDescription>Look up your vehicle using license plate information</CardDescription>
          </CardHeader>
          <CardContent>
            <PlateDecoderForm />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="manual" className="mt-6 z-0">
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle>Manual Entry</CardTitle>
            <CardDescription>Enter vehicle details manually for a custom valuation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <ManualEntryForm />
            
            <div className="border-t border-border pt-8">
              <ConditionSliderWithTooltip 
                score={conditionValue}
                onScoreChange={setConditionValue}
              />
            </div>
            
            <div className="border-t border-border pt-8">
              <AccidentHistoryInput
                hasAccidents={hasAccidents}
                setHasAccidents={setHasAccidents}
                accidentCount={accidentCount}
                setAccidentCount={setAccidentCount}
                accidentSeverity={accidentSeverity}
                setAccidentSeverity={setAccidentSeverity}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">Reset Form</Button>
            <Button>Get Valuation</Button>
          </CardFooter>
        </Card>
      </TabsContent>
      
      <div className="mt-8 flex justify-center">
        <Card className="border-2 border-primary w-full">
          <CardHeader className="bg-primary/5">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Premium Valuation</CardTitle>
                <CardDescription className="mt-1">CARFAX® Report Included</CardDescription>
              </div>
              <div className="text-lg font-bold">$29.99</div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium text-primary">Premium Features</h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                    <span>Full CARFAX® Vehicle History</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                    <span>Accident Damage Assessment</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                    <span>Service Record Verification</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                    <span>12-Month Value Forecast</span>
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="font-medium text-primary">Why Upgrade?</h4>
                <p className="text-sm text-text-secondary">
                  Our premium valuation includes a complete CARFAX® report ($44 value) and advanced 
                  market analysis, showing you how specific features and history affect your vehicle's value.
                </p>
                <Button className="w-full" size="lg" asChild>
                  <Link to="/premium">Get Premium Valuation</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Tabs>
  );
}
