
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { ChevronRight, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/components/ui/use-toast';
// Fix the import to use default export
import UnifiedValuationResult from '@/components/valuation/UnifiedValuationResult';

const conditions = [
  { label: 'Excellent', value: 'excellent' },
  { label: 'Good', value: 'good' },
  { label: 'Fair', value: 'fair' },
  { label: 'Poor', value: 'poor' },
];

export function FreeValuationPage() {
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [mileage, setMileage] = useState('');
  const [condition, setCondition] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [valuationId, setValuationId] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isManualValuation, setIsManualValuation] = useState(false);
  const [manualValuationData, setManualValuationData] = useState<any>(null);
  const navigate = useNavigate();

  const handleSubmit = useCallback(async (event: React.FormEvent) => {
    event.preventDefault();

    if (!make || !model || !year || !mileage || !condition || !zipCode) {
      setError('Please fill in all fields.');
      toast({
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    setProgress(30);
    setError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock valuation result
      const mockValuationId = 'valuation-' + Date.now();
      setValuationId(mockValuationId);
      setProgress(100);

      // Store manual valuation data
      setManualValuationData({
        make,
        model,
        year,
        mileage,
        condition,
        zipCode,
        estimatedValue: Math.floor(Math.random() * (30000 - 10000 + 1)) + 10000, // Random value between 10000 and 30000
        confidenceScore: 80,
        adjustments: [],
        explanation: 'This is a sample valuation based on the information provided.',
      });
      setIsManualValuation(true);

      toast({
        description: "Valuation generated successfully!",
        variant: "success",
      });

      // Navigate to the valuation result page
      navigate(`/valuation-result?valuationId=${mockValuationId}&isManual=true`);
    } catch (err) {
      console.error("Error during form submission:", err);
      setError('Failed to generate valuation. Please try again.');
      toast({
        description: "Failed to generate valuation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      setProgress(0);
    }
  }, [make, model, year, mileage, condition, zipCode, navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto py-12 px-4">
        <section className="mb-12">
          <h1 className="text-3xl font-semibold text-center mb-4">Get Your Free Vehicle Valuation</h1>
          <p className="text-lg text-gray-600 text-center">
            Enter your vehicle details to receive an instant valuation.
          </p>
        </section>

        <section className="max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Vehicle Details</CardTitle>
              <CardDescription>Enter the details of your vehicle to get started.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="grid gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="make">Make</Label>
                    <Input
                      type="text"
                      id="make"
                      placeholder="e.g., Toyota"
                      value={make}
                      onChange={(e) => setMake(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="model">Model</Label>
                    <Input
                      type="text"
                      id="model"
                      placeholder="e.g., Camry"
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="year">Year</Label>
                    <Input
                      type="number"
                      id="year"
                      placeholder="e.g., 2018"
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="mileage">Mileage</Label>
                    <Input
                      type="number"
                      id="mileage"
                      placeholder="e.g., 60000"
                      value={mileage}
                      onChange={(e) => setMileage(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="condition">Condition</Label>
                    <Select onValueChange={setCondition}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                      <SelectContent>
                        {conditions.map((cond) => (
                          <SelectItem key={cond.value} value={cond.value}>
                            {cond.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="zipCode">ZIP Code</Label>
                    <Input
                      type="number"
                      id="zipCode"
                      placeholder="e.g., 90210"
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {error && (
                  <p className="text-red-500 text-sm">{error}</p>
                )}

                <Button disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      Generating Valuation...
                      <Progress value={progress} className="w-40 ml-2" />
                    </>
                  ) : (
                    <>
                      Get Valuation
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default FreeValuationPage;
