<<<<<<< HEAD

import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
=======
import React, { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ConditionEvaluationForm } from "@/components/valuation/condition";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ConditionValues } from "@/components/valuation/condition/types";
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)

export default function PremiumConditionEvaluationPage() {
  const { id } = useParams();
  const navigate = useNavigate();
<<<<<<< HEAD
  
  // State for condition scores (typically 1-10)
  const [scores, setScores] = React.useState({
    exterior: 0,
    interior: 0,
    mechanical: 0,
    electrical: 0,
    undercarriage: 0
  });
  
  // Calculate total score - ensure all scores are numbers
  const totalScore = Object.values(scores).reduce((sum, score) => Number(sum) + Number(score), 0);
  
  // Calculate percentage (out of 50 possible points)
  const percentage = totalScore > 0 ? (totalScore / 50) * 100 : 0;
  
  const handleScoreChange = (category: keyof typeof scores, value: number) => {
    setScores(prev => ({
      ...prev,
      [category]: value
    }));
=======
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Updated to match the expected signature from ConditionEvaluationForm
  const handleConditionSubmit = (values: ConditionValues) => {
    setIsSubmitting(true);
    console.log("Condition assessment values:", values);

    // Calculate overall score here if needed
    const overallScore = Object.values(values).reduce(
      (sum, value) => sum + (typeof value === "number" ? value : 0),
      0,
    ) / Object.values(values).length;
    console.log("Overall condition score:", overallScore);

    // Store values in local storage for use in the valuation process
    localStorage.setItem("condition_factors", JSON.stringify(values));
    localStorage.setItem("condition_score", String(overallScore));

    // Mock API call to demonstrate the flow
    setTimeout(() => {
      toast.success("Condition assessment saved successfully");
      setIsSubmitting(false);
      // Navigate to the next step in the workflow
      navigate("/premium");
    }, 1000);
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, you'd save the condition data to the backend
    console.log('Condition scores:', scores);
    console.log('Total score:', totalScore);
    
    // Navigate to results page
    if (id) {
      navigate(`/premium-results/${id}`);
    } else {
      navigate('/premium-results');
    }
  };
  
  return (
<<<<<<< HEAD
    <div className="container mx-auto py-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Vehicle Condition Evaluation</h1>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Vehicle Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <Label className="text-muted-foreground">VIN</Label>
              <p className="font-mono">1HGCM82633A123456</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Vehicle</Label>
              <p>2020 Toyota Camry XSE</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <form onSubmit={handleSubmit}>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Exterior Condition</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="exterior">Paint & Body (0-10)</Label>
              <Input 
                id="exterior" 
                type="number" 
                min="0" 
                max="10" 
                value={scores.exterior} 
                onChange={(e) => handleScoreChange('exterior', Number(e.target.value))}
              />
            </div>
            
            <div>
              <Label htmlFor="exteriorNotes">Notes</Label>
              <Textarea 
                id="exteriorNotes" 
                placeholder="Describe any scratches, dents, or paint issues..."
              />
            </div>
          </CardContent>
        </Card>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Interior Condition</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="interior">Interior (0-10)</Label>
              <Input 
                id="interior" 
                type="number" 
                min="0" 
                max="10" 
                value={scores.interior} 
                onChange={(e) => handleScoreChange('interior', Number(e.target.value))}
              />
            </div>
            
            <div>
              <Label htmlFor="interiorNotes">Notes</Label>
              <Textarea 
                id="interiorNotes" 
                placeholder="Describe any wear, tears, stains, or dashboard issues..."
              />
            </div>
          </CardContent>
        </Card>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Mechanical Condition</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="mechanical">Engine & Transmission (0-10)</Label>
              <Input 
                id="mechanical" 
                type="number" 
                min="0" 
                max="10" 
                value={scores.mechanical} 
                onChange={(e) => handleScoreChange('mechanical', Number(e.target.value))}
              />
            </div>
            
            <div>
              <Label htmlFor="mechanicalNotes">Notes</Label>
              <Textarea 
                id="mechanicalNotes" 
                placeholder="Describe any engine noises, leaks, or transmission issues..."
              />
            </div>
          </CardContent>
        </Card>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Electrical & Features</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="electrical">Electrical Systems (0-10)</Label>
              <Input 
                id="electrical" 
                type="number" 
                min="0" 
                max="10" 
                value={scores.electrical} 
                onChange={(e) => handleScoreChange('electrical', Number(e.target.value))}
              />
            </div>
            
            <div>
              <Label htmlFor="electricalNotes">Notes</Label>
              <Textarea 
                id="electricalNotes" 
                placeholder="Describe any electrical issues or non-working features..."
              />
            </div>
          </CardContent>
        </Card>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Undercarriage</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="undercarriage">Suspension & Exhaust (0-10)</Label>
              <Input 
                id="undercarriage" 
                type="number" 
                min="0" 
                max="10" 
                value={scores.undercarriage} 
                onChange={(e) => handleScoreChange('undercarriage', Number(e.target.value))}
              />
            </div>
            
            <div>
              <Label htmlFor="undercarriageNotes">Notes</Label>
              <Textarea 
                id="undercarriageNotes" 
                placeholder="Describe any suspension issues, rust, or exhaust problems..."
              />
            </div>
          </CardContent>
        </Card>
        
        <div className="flex items-center justify-between p-4 bg-muted rounded-lg mb-8">
          <div>
            <p className="text-sm font-medium">Overall Condition Score</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold">{totalScore}</span>
              <span className="text-sm text-muted-foreground">/ 50</span>
              <span className="text-sm">({percentage.toFixed(0)}%)</span>
            </div>
          </div>
          <div className="w-24 h-24 rounded-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-background flex items-center justify-center">
              <span className="text-2xl font-bold">{percentage.toFixed(0)}%</span>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button type="submit">
            Complete Evaluation
          </Button>
=======
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
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
            Provide a detailed assessment of your vehicle's condition for the
            most accurate valuation.
          </p>
        </div>

        <div className="bg-white shadow-sm rounded-lg border p-6 mb-8">
          <ConditionEvaluationForm
            onSubmit={handleConditionSubmit}
            onCancel={() => navigate("/premium")}
          />
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
        </div>
      </form>
    </div>
  );
}
