import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UnifiedLookupTabs } from '@/components/lookup/UnifiedLookupTabs';
import { ProfessionalCard, CardContent } from '@/components/ui/enhanced/ProfessionalCard';
import { ProfessionalButton } from '@/components/ui/enhanced/ProfessionalButton';
import { ArrowLeft } from 'lucide-react';

export default function GetValuationPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        {/* Header with back button */}
        <div className="mb-8">
          <ProfessionalButton 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </ProfessionalButton>
          
          <div className="text-center">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Free Vehicle Valuation
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get an instant, basic vehicle valuation at no cost. Enter your VIN or license plate below.
            </p>
          </div>
        </div>
        
        <ProfessionalCard variant="elevated" className="max-w-4xl mx-auto">
          <CardContent className="p-8">
            <UnifiedLookupTabs />
          </CardContent>
        </ProfessionalCard>
        
        {/* Upgrade notice */}
        <div className="text-center mt-8">
          <p className="text-muted-foreground mb-4">
            Want more detailed insights including CARFAX® history and dealer offers?
          </p>
          <ProfessionalButton 
            variant="premium" 
            onClick={() => navigate('/premium')}
          >
            Upgrade to Premium Valuation - $29.99
          </ProfessionalButton>
        </div>
      </div>
    </div>
  );
}