import React, { useState } from 'react';
import { ProfessionalModal, StepProgress } from '@/components/ui/enhanced/ProfessionalModal';
import { ProfessionalButton } from '@/components/ui/enhanced/ProfessionalButton';
import { ProfessionalCard, CardContent } from '@/components/ui/enhanced/ProfessionalCard';
import { CheckCircle, Star, Award, Clock, FileText } from 'lucide-react';

interface ValuationStepsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartValuation: (type: 'basic' | 'premium') => void;
}

export function ValuationStepsModal({
  isOpen,
  onClose,
  onStartValuation
}: ValuationStepsModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<'basic' | 'premium'>('premium');

  const steps = [
    { label: 'Choose Plan', completed: false },
    { label: 'Vehicle Info', completed: false },
    { label: 'Get Report', completed: false }
  ];

  return (
    <ProfessionalModal
      isOpen={isOpen}
      onClose={onClose}
      title="Get Your Vehicle Valuation"
      subtitle="Choose your valuation type and we'll guide you through the process"
      size="lg"
    >
      <StepProgress currentStep={1} totalSteps={3} steps={steps} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Plan */}
        <ProfessionalCard 
          variant={selectedPlan === 'basic' ? 'elevated' : 'outline'}
          className={`cursor-pointer transition-all duration-200 ${
            selectedPlan === 'basic' 
              ? 'ring-2 ring-primary shadow-lg scale-105' 
              : 'hover:shadow-md'
          }`}
          onClick={() => setSelectedPlan('basic')}
        >
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-8 h-8 text-muted-foreground" />
            </div>
            
            <h3 className="text-xl font-bold text-foreground mb-2">Basic Valuation</h3>
            <div className="text-2xl font-bold text-primary mb-4">FREE</div>
            
            <div className="space-y-3 text-left mb-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
                <span className="text-sm text-muted-foreground">Basic market estimate</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
                <span className="text-sm text-muted-foreground">Single-photo AI demo</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
                <span className="text-sm text-muted-foreground">CARFAX preview</span>
              </div>
            </div>
            
            <div className="bg-muted/30 rounded-lg p-3 text-xs text-muted-foreground">
              Perfect for getting a quick estimate
            </div>
          </CardContent>
        </ProfessionalCard>

        {/* Premium Plan */}
        <ProfessionalCard 
          variant={selectedPlan === 'premium' ? 'premium' : 'outline'}
          className={`cursor-pointer transition-all duration-200 relative ${
            selectedPlan === 'premium' 
              ? 'ring-2 ring-primary shadow-xl scale-105' 
              : 'hover:shadow-md'
          }`}
          onClick={() => setSelectedPlan('premium')}
        >
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <span className="bg-warning text-warning-foreground px-3 py-1 rounded-full text-xs font-bold">
              RECOMMENDED
            </span>
          </div>
          
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8 text-primary" />
            </div>
            
            <h3 className="text-xl font-bold text-foreground mb-2">Premium Analysis</h3>
            <div className="flex items-end justify-center gap-1 mb-2">
              <span className="text-2xl font-bold text-primary">$29.99</span>
              <span className="text-sm text-muted-foreground mb-1">one-time</span>
            </div>
            <div className="bg-success/10 text-success px-2 py-1 rounded-full text-xs font-medium mb-4">
              Includes $44 CARFAX® Report
            </div>
            
            <div className="space-y-3 text-left mb-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
                <span className="text-sm font-medium text-foreground">Complete CARFAX® report</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
                <span className="text-sm font-medium text-foreground">Multi-photo AI analysis</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
                <span className="text-sm font-medium text-foreground">Market analysis</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
                <span className="text-sm font-medium text-foreground">12-month predictions</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
                <span className="text-sm font-medium text-foreground">Dealer offers</span>
              </div>
            </div>
            
            <div className="bg-primary/5 rounded-lg p-3 text-xs text-primary font-medium">
              Professional-grade comprehensive analysis
            </div>
          </CardContent>
        </ProfessionalCard>
      </div>
      
      {/* Process Overview */}
      <div className="mt-8 bg-muted/30 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-foreground mb-4 text-center">
          What happens next?
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-bold text-primary">1</span>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Enter vehicle info</p>
              <p className="text-xs text-muted-foreground">VIN or license plate</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-bold text-primary">2</span>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">AI Analysis</p>
              <p className="text-xs text-muted-foreground">Instant processing</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
              <Clock className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Get your report</p>
              <p className="text-xs text-muted-foreground">Delivered instantly</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="flex gap-4 mt-8">
        <ProfessionalButton
          variant="outline"
          size="lg"
          onClick={() => onStartValuation('basic')}
          className="flex-1"
          disabled={selectedPlan !== 'basic'}
        >
          Start Basic Valuation (FREE)
        </ProfessionalButton>
        
        <ProfessionalButton
          variant="premium"
          size="lg"
          onClick={() => onStartValuation('premium')}
          className="flex-1"
          disabled={selectedPlan !== 'premium'}
        >
          <Award className="w-4 h-4 mr-2" />
          Get Premium Analysis - $29.99
        </ProfessionalButton>
      </div>
    </ProfessionalModal>
  );
}