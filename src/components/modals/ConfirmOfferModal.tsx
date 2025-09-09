import React, { useState } from 'react';
import { ProfessionalModal, StepProgress, ToggleButton } from '@/components/ui/enhanced/ProfessionalModal';
import { ProfessionalButton } from '@/components/ui/enhanced/ProfessionalButton';
import { ProfessionalCard, CardContent } from '@/components/ui/enhanced/ProfessionalCard';
import { HelpCircle } from 'lucide-react';

interface ConfirmOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialOffer: string;
  vehicleInfo: {
    year: string;
    make: string;
    model: string;
    trim: string;
    image: string;
  };
  onConfirmOffer: (data: any) => void;
}

interface FormData {
  vinOrPlate: string;
  vehicleHistory: string;
  engineIssues: string;
  dashboardWarnings: string;
  aftermarketParts: string;
}

export function ConfirmOfferModal({
  isOpen,
  onClose,
  initialOffer,
  vehicleInfo,
  onConfirmOffer
}: ConfirmOfferModalProps) {
  const [activeTab, setActiveTab] = useState<'vin' | 'plate'>('vin');
  const [formData, setFormData] = useState<FormData>({
    vinOrPlate: '',
    vehicleHistory: 'nope',
    engineIssues: 'nope',
    dashboardWarnings: 'nope',
    aftermarketParts: 'nope'
  });

  const steps = [
    { label: 'Initial Offer', completed: true },
    { label: 'Confirm Offer', completed: false },
    { label: 'Sell Car', completed: false }
  ];

  const handleSubmit = () => {
    onConfirmOffer(formData);
  };

  return (
    <ProfessionalModal
      isOpen={isOpen}
      onClose={onClose}
      title="Confirm Your Initial Offer"
      subtitle="Your offer may be higher or lower. We just need a few important bits of information to finalize a GREAT offer!"
      size="xl"
    >
      <StepProgress currentStep={2} totalSteps={3} steps={steps} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Side - Vehicle Info */}
        <div className="space-y-6">
          <ProfessionalCard variant="elevated">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-foreground mb-4">
                Initial Offer: {initialOffer}
              </div>
              
              <div className="bg-muted/30 rounded-xl p-4 mb-4">
                <img 
                  src={vehicleInfo.image} 
                  alt="Vehicle" 
                  className="w-full h-32 object-cover rounded-lg mb-4"
                />
              </div>
              
              <div className="text-center">
                <h3 className="text-lg font-semibold text-foreground">
                  {vehicleInfo.year} {vehicleInfo.make} {vehicleInfo.model}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {vehicleInfo.trim}
                </p>
                <button className="text-sm text-primary hover:underline mt-2">
                  Not your car?
                </button>
              </div>
              
              <div className="mt-6 pt-4 border-t border-border">
                <button className="text-sm text-muted-foreground hover:text-foreground">
                  I'll come back later.
                </button>
              </div>
            </CardContent>
          </ProfessionalCard>
        </div>
        
        {/* Right Side - Form */}
        <div className="space-y-6">
          {/* Vehicle Information */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-lg font-semibold text-foreground">Vehicle Information</h3>
              <div className="h-1 bg-warning rounded-full flex-1" />
            </div>
            
            <p className="text-sm text-muted-foreground mb-4">
              Enter your VIN OR License Plate Number
            </p>
            
            <ToggleButton
              options={[
                { label: 'VIN #', value: 'vin' },
                { label: 'License Plate', value: 'plate' }
              ]}
              value={activeTab}
              onChange={(value) => setActiveTab(value as 'vin' | 'plate')}
              className="mb-4"
            />
            
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Enter Here"
                value={formData.vinOrPlate}
                onChange={(e) => setFormData(prev => ({ ...prev, vinOrPlate: e.target.value }))}
                className="w-full p-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              
              <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                <HelpCircle className="w-4 h-4" />
                How do I find my VIN?
              </button>
            </div>
          </div>
          
          {/* Vehicle Condition Details */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-lg font-semibold text-foreground">Vehicle Condition Details</h3>
              <div className="h-1 bg-warning rounded-full flex-1" />
            </div>
            
            <div className="space-y-6">
              {[
                {
                  key: 'vehicleHistory',
                  question: 'Any vehicle history issues or title brand? (e.g. accident, flood, etc.)'
                },
                {
                  key: 'engineIssues',
                  question: 'Any engine and/or drivability issues?'
                },
                {
                  key: 'dashboardWarnings',
                  question: 'Any dashboard warning lights or inoperable parts? (e.g. Check Engine, Airbag Light, A/C issue, etc.)'
                },
                {
                  key: 'aftermarketParts',
                  question: 'Any aftermarket parts or modifications?'
                }
              ].map((item) => (
                <div key={item.key}>
                  <p className="text-sm font-medium text-foreground mb-3">
                    {item.question}
                  </p>
                  <ToggleButton
                    options={[
                      { label: 'Nope!', value: 'nope' },
                      { label: 'Yes', value: 'yes' }
                    ]}
                    value={formData[item.key as keyof FormData]}
                    onChange={(value) => setFormData(prev => ({ ...prev, [item.key]: value }))}
                  />
                </div>
              ))}
            </div>
          </div>
          
          {/* Submit Button */}
          <div className="pt-6">
            <ProfessionalButton
              variant="premium"
              size="lg"
              onClick={handleSubmit}
              className="w-full"
              disabled={!formData.vinOrPlate}
            >
              Continue to Final Offer
            </ProfessionalButton>
          </div>
        </div>
      </div>
    </ProfessionalModal>
  );
}