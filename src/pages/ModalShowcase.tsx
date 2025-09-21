import React, { useState } from 'react';
import { ProfessionalButton } from '@/components/ui/enhanced/ProfessionalButton';
import { ProfessionalCard, CardContent, CardHeader, CardTitle } from '@/components/ui/enhanced/ProfessionalCard';
import { PhotoToolModal } from '@/components/modals/PhotoToolModal';
import { ConfirmOfferModal } from '@/components/modals/ConfirmOfferModal';
import { ValuationStepsModal } from '@/components/modals/ValuationStepsModal';
import { Camera, FileText, Star } from 'lucide-react';

export default function ModalShowcase() {
  const [photoToolOpen, setPhotoToolOpen] = useState(false);
  const [confirmOfferOpen, setConfirmOfferOpen] = useState(false);
  const [valuationStepsOpen, setValuationStepsOpen] = useState(false);

  const mockVehicleInfo = {
    year: '2023',
    make: 'Nissan',
    model: 'Altima',
    trim: 'Sedan 4D S 2.5L I4',
    image: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400&h=300&fit=crop'
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Professional Modal Components
            </h1>
            <p className="text-xl text-muted-foreground">
              Advanced, professional modal interfaces with sober design aesthetics
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Photo Tool Modal Demo */}
            <ProfessionalCard variant="elevated" className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Camera className="w-8 h-8 text-primary" />
                </div>
                <CardTitle>Photo Tool Modal</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">
                  Professional step-by-step photo capture workflow with multiple options
                </p>
                <ProfessionalButton
                  variant="premium"
                  onClick={() => setPhotoToolOpen(true)}
                  className="w-full"
                >
                  View Photo Modal
                </ProfessionalButton>
              </CardContent>
            </ProfessionalCard>

            {/* Confirm Offer Modal Demo */}
            <ProfessionalCard variant="elevated" className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-success/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-success" />
                </div>
                <CardTitle>Confirm Offer Modal</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">
                  Comprehensive form interface for offer confirmation with vehicle details
                </p>
                <ProfessionalButton
                  variant="default"
                  onClick={() => setConfirmOfferOpen(true)}
                  className="w-full"
                >
                  View Offer Modal
                </ProfessionalButton>
              </CardContent>
            </ProfessionalCard>

            {/* Valuation Steps Modal Demo */}
            <ProfessionalCard variant="elevated" className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-warning/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-warning" />
                </div>
                <CardTitle>Valuation Steps Modal</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">
                  Plan selection and process overview with step-by-step guidance
                </p>
                <ProfessionalButton
                  variant="outline"
                  onClick={() => setValuationStepsOpen(true)}
                  className="w-full"
                >
                  View Steps Modal
                </ProfessionalButton>
              </CardContent>
            </ProfessionalCard>
          </div>

          {/* Features Overview */}
          <div className="mt-16">
            <ProfessionalCard variant="elevated" className="bg-muted/30">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
                  Professional Modal Features
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <span className="text-primary font-bold">✓</span>
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">Step Progress Indicators</h3>
                    <p className="text-sm text-muted-foreground">Visual progress tracking with completed states</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <span className="text-primary font-bold">✓</span>
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">Professional Typography</h3>
                    <p className="text-sm text-muted-foreground">Consistent, readable text hierarchy</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <span className="text-primary font-bold">✓</span>
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">Responsive Design</h3>
                    <p className="text-sm text-muted-foreground">Optimized for all screen sizes</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <span className="text-primary font-bold">✓</span>
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">Interactive Components</h3>
                    <p className="text-sm text-muted-foreground">Toggle buttons, cards, and form elements</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <span className="text-primary font-bold">✓</span>
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">Consistent Branding</h3>
                    <p className="text-sm text-muted-foreground">Unified design system integration</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <span className="text-primary font-bold">✓</span>
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">Accessibility Ready</h3>
                    <p className="text-sm text-muted-foreground">WCAG compliant design patterns</p>
                  </div>
                </div>
              </CardContent>
            </ProfessionalCard>
          </div>
        </div>
      </div>

      {/* Modals */}
      <PhotoToolModal
        isOpen={photoToolOpen}
        onClose={() => setPhotoToolOpen(false)}
        onPhotoToolSelect={(option) => {
          setPhotoToolOpen(false);
        }}
        onSkipToFinalOffer={() => {
          setPhotoToolOpen(false);
        }}
      />

      <ConfirmOfferModal
        isOpen={confirmOfferOpen}
        onClose={() => setConfirmOfferOpen(false)}
        initialOffer="$15,184"
        vehicleInfo={mockVehicleInfo}
        onConfirmOffer={(data) => {
          setConfirmOfferOpen(false);
        }}
      />

      <ValuationStepsModal
        isOpen={valuationStepsOpen}
        onClose={() => setValuationStepsOpen(false)}
        onStartValuation={(type) => {
          setValuationStepsOpen(false);
        }}
      />
    </div>
  );
}