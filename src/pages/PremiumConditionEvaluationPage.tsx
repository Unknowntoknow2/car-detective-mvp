
import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ConditionEvaluationForm } from '@/components/valuation/condition';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export default function PremiumConditionEvaluationPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConditionSubmit = (values: Record<string, number>, overallScore: number) => {
    setIsSubmitting(true);
    console.log("Condition assessment values:", values);
    console.log("Overall condition score:", overallScore);
    
    // In a real implementation, you would save these values
    // to your state management system or API
    setTimeout(() => {
      toast.success("Condition assessment saved successfully");
      setIsSubmitting(false);
      // Navigate to the next step in your workflow
      navigate('/premium');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Button variant="ghost" size="sm" asChild className="mb-4">
            <Link to="/premium">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Premium Valuation
            </Link>
          </Button>
          
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-2">
            Enterprise Condition Evaluation
          </h1>
          <p className="text-lg text-gray-600">
            Provide a detailed assessment of your vehicle's condition for the most accurate valuation.
          </p>
        </div>
        
        <div className="bg-white shadow-sm rounded-lg border p-6">
          <ConditionEvaluationForm 
            onSubmit={handleConditionSubmit}
            onCancel={() => navigate('/premium')}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}
