import React from 'react';
import { ProfessionalModal, StepProgress, OptionCard } from '@/components/ui/enhanced/ProfessionalModal';
import { ProfessionalButton } from '@/components/ui/enhanced/ProfessionalButton';
import { Camera, Mail, Globe } from 'lucide-react';

interface PhotoToolModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPhotoToolSelect: (option: string) => void;
  onSkipToFinalOffer: () => void;
}

export function PhotoToolModal({
  isOpen,
  onClose,
  onPhotoToolSelect,
  onSkipToFinalOffer
}: PhotoToolModalProps) {
  const steps = [
    { label: 'Initial Offer', completed: true },
    { label: 'Confirm Offer', completed: false },
    { label: 'Sell Car', completed: false }
  ];

  return (
    <ProfessionalModal
      isOpen={isOpen}
      onClose={onClose}
      title="One Final Easy Step!"
      subtitle="Select an option below:"
      size="lg"
    >
      <StepProgress currentStep={2} totalSteps={3} steps={steps} />
      
      <div className="space-y-6">
        {/* Recommended Option */}
        <OptionCard
          title="Use our awesome photo tool!"
          description="Fully guided and super-duper easy! Takes under a minute using a smartphone. Lasers in exact condition for best offer."
          recommended
          icon={<Camera className="w-6 h-6 text-primary" />}
          onClick={() => onPhotoToolSelect('photo-tool')}
        />
        
        {/* Instructions */}
        <div className="bg-muted/30 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            On your phone, do one of the following:
          </h3>
          
          <div className="space-y-4">
            {/* Email Option */}
            <div className="flex items-start gap-4 p-4 bg-background rounded-lg border border-border">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-foreground mb-1">
                  Access our photo tool via email or text
                </h4>
                <p className="text-sm text-muted-foreground">
                  We've sent you an email and text. On your phone, simply click the link to continue.
                </p>
              </div>
            </div>
            
            {/* OR Divider */}
            <div className="text-center">
              <span className="bg-muted px-3 py-1 rounded-full text-sm font-medium text-muted-foreground">
                -OR-
              </span>
            </div>
            
            {/* Website Option */}
            <div className="flex items-start gap-4 p-4 bg-background rounded-lg border border-border">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Globe className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-foreground mb-1">
                  Go to www.whipflip.com on your phone
                </h4>
                <p className="text-sm text-muted-foreground">
                  Tap the "Retrieve Offer" button and enter your email address.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Fast Forward Option */}
        <div className="border-t border-border pt-6">
          <h3 className="text-xl font-bold text-foreground text-center mb-4">
            OPTION 2: FAST-FORWARD
          </h3>
          
          <div className="bg-muted/30 rounded-xl p-6 text-center">
            <h4 className="text-lg font-semibold text-foreground mb-2">
              Can't take the photos right now?
            </h4>
            <p className="text-muted-foreground mb-4">
              Your instant offer is a click away! We'll confirm the exact condition at your driveway. 
              The final value might change.
            </p>
            
            <ProfessionalButton
              variant="default"
              size="lg"
              onClick={onSkipToFinalOffer}
              className="w-full bg-warning hover:bg-warning/90 text-warning-foreground"
            >
              Skip to Final Offer
            </ProfessionalButton>
          </div>
        </div>
      </div>
    </ProfessionalModal>
  );
}