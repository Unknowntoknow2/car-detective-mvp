
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronRight, ChevronLeft } from 'lucide-react';

interface FollowUpFormProps {
  onSubmit: (data: any) => void;
  initialData?: any;
}

// Categories for vehicle condition assessment
const categories = [
  {
    id: 'basic',
    title: 'Basic Information',
    questions: [
      { id: 'mileage', type: 'number', label: 'Mileage', placeholder: 'Enter current mileage' },
      { id: 'zipCode', type: 'text', label: 'ZIP Code', placeholder: 'Enter your ZIP code' }
    ]
  },
  {
    id: 'exteriorBody',
    title: 'Exterior Body Condition',
    questions: [
      { 
        id: 'exteriorCondition', 
        type: 'radio', 
        label: 'How would you rate the exterior body condition?',
        options: [
          { value: 'excellent', label: 'Excellent - Like new, no visible issues' },
          { value: 'good', label: 'Good - Minor scratches or dings' },
          { value: 'fair', label: 'Fair - Noticeable dents or damage' },
          { value: 'poor', label: 'Poor - Significant damage or rust' }
        ]
      }
    ]
  },
  {
    id: 'exteriorPaint',
    title: 'Exterior Paint',
    questions: [
      { 
        id: 'paintCondition', 
        type: 'radio', 
        label: 'How would you rate the paint condition?',
        options: [
          { value: 'excellent', label: 'Excellent - Like new, glossy finish' },
          { value: 'good', label: 'Good - Minor scratches or fading' },
          { value: 'fair', label: 'Fair - Noticeable scratches or peeling' },
          { value: 'poor', label: 'Poor - Significant peeling or damage' }
        ]
      }
    ]
  },
  {
    id: 'interiorSeats',
    title: 'Interior Seats',
    questions: [
      { 
        id: 'seatsCondition', 
        type: 'radio', 
        label: 'How would you rate the seats condition?',
        options: [
          { value: 'excellent', label: 'Excellent - Like new, no visible wear' },
          { value: 'good', label: 'Good - Minor wear or small stains' },
          { value: 'fair', label: 'Fair - Noticeable wear or tears' },
          { value: 'poor', label: 'Poor - Significant damage or stains' }
        ]
      }
    ]
  },
  {
    id: 'interiorDashboard',
    title: 'Dashboard & Controls',
    questions: [
      { 
        id: 'dashboardCondition', 
        type: 'radio', 
        label: 'How would you rate the dashboard and controls condition?',
        options: [
          { value: 'excellent', label: 'Excellent - Like new, all features working' },
          { value: 'good', label: 'Good - Minor wear, all features working' },
          { value: 'fair', label: 'Fair - Noticeable wear, minor issues' },
          { value: 'poor', label: 'Poor - Significant wear, some features not working' }
        ]
      }
    ]
  },
  {
    id: 'mechanicalEngine',
    title: 'Engine Performance',
    questions: [
      { 
        id: 'engineCondition', 
        type: 'radio', 
        label: 'How would you rate the engine performance?',
        options: [
          { value: 'excellent', label: 'Excellent - Runs perfectly, no issues' },
          { value: 'good', label: 'Good - Runs well, minor maintenance needed' },
          { value: 'fair', label: 'Fair - Some issues, but generally reliable' },
          { value: 'poor', label: 'Poor - Significant issues or repairs needed' }
        ]
      }
    ]
  },
  {
    id: 'mechanicalTransmission',
    title: 'Transmission',
    questions: [
      { 
        id: 'transmissionCondition', 
        type: 'radio', 
        label: 'How would you rate the transmission condition?',
        options: [
          { value: 'excellent', label: 'Excellent - Shifts smoothly, no issues' },
          { value: 'good', label: 'Good - Minor hesitation but functions well' },
          { value: 'fair', label: 'Fair - Noticeable issues, but operational' },
          { value: 'poor', label: 'Poor - Significant issues or repairs needed' }
        ]
      }
    ]
  },
  {
    id: 'tiresCondition',
    title: 'Tires',
    questions: [
      { 
        id: 'tiresCondition', 
        type: 'radio', 
        label: 'How would you rate the tire condition?',
        options: [
          { value: 'excellent', label: 'Excellent - New or nearly new tires' },
          { value: 'good', label: 'Good - Significant tread life remaining' },
          { value: 'fair', label: 'Fair - About half tread life remaining' },
          { value: 'poor', label: 'Poor - Minimal tread life, replacement needed soon' }
        ]
      }
    ]
  },
  {
    id: 'historyAccidents',
    title: 'Accident History',
    questions: [
      { 
        id: 'hasAccidentHistory', 
        type: 'radio', 
        label: 'Has the vehicle been in any accidents?',
        options: [
          { value: 'none', label: 'No accidents reported' },
          { value: 'minor', label: 'Minor accident (no structural damage)' },
          { value: 'moderate', label: 'Moderate accident (some frame/structural repair)' },
          { value: 'severe', label: 'Severe accident (significant frame/structural damage)' }
        ]
      }
    ]
  },
  {
    id: 'titleStatus',
    title: 'Title Status',
    questions: [
      { 
        id: 'titleStatus', 
        type: 'select', 
        label: 'What is the current title status?',
        options: [
          { value: 'clean', label: 'Clean Title' },
          { value: 'salvage', label: 'Salvage Title' },
          { value: 'rebuilt', label: 'Rebuilt/Reconstructed' },
          { value: 'lemon', label: 'Lemon Law Buyback' },
          { value: 'other', label: 'Other Title Issue' }
        ]
      }
    ]
  },
  {
    id: 'serviceHistory',
    title: 'Service History',
    questions: [
      { 
        id: 'serviceHistory', 
        type: 'radio', 
        label: 'How would you describe the service history?',
        options: [
          { value: 'complete', label: 'Complete dealer service records' },
          { value: 'partial', label: 'Partial service records available' },
          { value: 'regular', label: 'Regular maintenance, limited records' },
          { value: 'unknown', label: 'Unknown service history' }
        ]
      }
    ]
  },
  {
    id: 'premiumFeatures',
    title: 'Premium Features',
    questions: [
      { 
        id: 'features', 
        type: 'checkbox', 
        label: 'Select all premium features that apply:',
        options: [
          { id: 'leather', label: 'Leather Seats' },
          { id: 'sunroof', label: 'Sunroof/Moonroof' },
          { id: 'navigation', label: 'Navigation System' },
          { id: 'premium_audio', label: 'Premium Audio System' },
          { id: 'safety_package', label: 'Advanced Safety Package' },
          { id: 'driver_assist', label: 'Driver Assistance Package' },
          { id: 'cold_weather', label: 'Cold Weather Package' },
          { id: 'towing', label: 'Towing Package' }
        ]
      }
    ]
  },
  {
    id: 'ownership',
    title: 'Ownership',
    questions: [
      { 
        id: 'owners', 
        type: 'select', 
        label: 'How many previous owners has the vehicle had?',
        options: [
          { value: '0', label: 'No previous owners (original owner)' },
          { value: '1', label: '1 previous owner' },
          { value: '2', label: '2 previous owners' },
          { value: '3', label: '3 or more previous owners' },
          { value: 'unknown', label: 'Unknown' }
        ]
      }
    ]
  },
  {
    id: 'usage',
    title: 'Vehicle Usage',
    questions: [
      { 
        id: 'vehicleUsage', 
        type: 'radio', 
        label: 'What has been the primary use of this vehicle?',
        options: [
          { value: 'personal', label: 'Personal/Commuter use only' },
          { value: 'family', label: 'Family vehicle with light use' },
          { value: 'mixed', label: 'Mixed personal and business use' },
          { value: 'business', label: 'Primary business/commercial use' },
          { value: 'rideshare', label: 'Rideshare/Taxi service' }
        ]
      }
    ]
  },
  {
    id: 'overall',
    title: 'Overall Condition',
    questions: [
      { 
        id: 'condition', 
        type: 'radio', 
        label: 'How would you rate the overall condition of your vehicle?',
        options: [
          { value: 'excellent', label: 'Excellent - Nearly new condition with minimal wear' },
          { value: 'good', label: 'Good - Well maintained with normal wear for age/mileage' },
          { value: 'fair', label: 'Fair - Functional but shows significant wear or age' },
          { value: 'poor', label: 'Poor - Multiple issues requiring attention/repair' }
        ]
      }
    ]
  }
];

const FollowUpForm: React.FC<FollowUpFormProps> = ({ onSubmit, initialData = {} }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<any>({
    // Set default values or use initialData
    mileage: initialData.mileage || '',
    zipCode: initialData.zipCode || '',
    condition: initialData.condition || 'good',
    exteriorCondition: 'good',
    paintCondition: 'good',
    seatsCondition: 'good',
    dashboardCondition: 'good',
    engineCondition: 'good',
    transmissionCondition: 'good',
    tiresCondition: 'good',
    hasAccidentHistory: 'none',
    titleStatus: 'clean',
    serviceHistory: 'regular',
    owners: '1',
    vehicleUsage: 'personal',
    features: []
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prevData => ({ ...prevData, [field]: value }));
  };

  const handleCheckboxChange = (field: string, itemId: string, checked: boolean) => {
    const currentItems = [...(formData[field] || [])];
    if (checked) {
      if (!currentItems.includes(itemId)) {
        currentItems.push(itemId);
      }
    } else {
      const index = currentItems.indexOf(itemId);
      if (index > -1) {
        currentItems.splice(index, 1);
      }
    }
    setFormData(prevData => ({ ...prevData, [field]: currentItems }));
  };

  const nextStep = () => {
    if (currentStep < categories.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    // Calculate overall condition if not explicitly provided
    const conditionValues = [
      formData.exteriorCondition,
      formData.paintCondition,
      formData.seatsCondition,
      formData.dashboardCondition,
      formData.engineCondition,
      formData.transmissionCondition,
      formData.tiresCondition
    ];
    
    // Count occurrences of each condition
    const conditionCounts = conditionValues.reduce((acc: any, val) => {
      acc[val] = (acc[val] || 0) + 1;
      return acc;
    }, {});
    
    // Get most common condition, or default to 'good'
    let mostCommonCondition = 'good';
    let maxCount = 0;
    
    Object.entries(conditionCounts).forEach(([condition, count]) => {
      if (count > maxCount) {
        mostCommonCondition = condition;
        maxCount = count as number;
      }
    });
    
    // Only override if user didn't explicitly select overall condition
    const finalData = {
      ...formData,
      condition: formData.condition || mostCommonCondition
    };
    
    onSubmit(finalData);
  };

  const renderQuestion = (question: any) => {
    switch (question.type) {
      case 'text':
        return (
          <div className="mb-4" key={question.id}>
            <Label htmlFor={question.id}>{question.label}</Label>
            <Input
              id={question.id}
              type="text"
              placeholder={question.placeholder}
              value={formData[question.id] || ''}
              onChange={(e) => handleInputChange(question.id, e.target.value)}
              className="mt-1"
            />
          </div>
        );
      case 'number':
        return (
          <div className="mb-4" key={question.id}>
            <Label htmlFor={question.id}>{question.label}</Label>
            <Input
              id={question.id}
              type="number"
              placeholder={question.placeholder}
              value={formData[question.id] || ''}
              onChange={(e) => handleInputChange(question.id, parseInt(e.target.value) || '')}
              className="mt-1"
            />
          </div>
        );
      case 'radio':
        return (
          <div className="mb-4" key={question.id}>
            <Label>{question.label}</Label>
            <RadioGroup
              value={formData[question.id] || ''}
              onValueChange={(value) => handleInputChange(question.id, value)}
              className="mt-2 space-y-2"
            >
              {question.options.map((option: any) => (
                <div className="flex items-center space-x-2" key={option.value}>
                  <RadioGroupItem value={option.value} id={`${question.id}-${option.value}`} />
                  <Label htmlFor={`${question.id}-${option.value}`} className="cursor-pointer">
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        );
      case 'select':
        return (
          <div className="mb-4" key={question.id}>
            <Label htmlFor={question.id}>{question.label}</Label>
            <Select
              value={formData[question.id] || ''}
              onValueChange={(value) => handleInputChange(question.id, value)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                {question.options.map((option: any) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
      case 'checkbox':
        return (
          <div className="mb-4" key={question.id}>
            <Label>{question.label}</Label>
            <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
              {question.options.map((option: any) => (
                <div className="flex items-center space-x-2" key={option.id}>
                  <Checkbox
                    id={`${question.id}-${option.id}`}
                    checked={(formData[question.id] || []).includes(option.id)}
                    onCheckedChange={(checked) => 
                      handleCheckboxChange(question.id, option.id, !!checked)
                    }
                  />
                  <Label htmlFor={`${question.id}-${option.id}`} className="cursor-pointer">
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const currentCategory = categories[currentStep];

  return (
    <div>
      <div className="text-sm text-muted-foreground mb-4">
        Step {currentStep + 1} of {categories.length}
      </div>
      
      <Card className="p-6 mb-6">
        <h3 className="text-lg font-medium mb-4">{currentCategory.title}</h3>
        {currentCategory.questions.map(renderQuestion)}
      </Card>

      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={prevStep} 
          disabled={currentStep === 0}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>
        <Button onClick={nextStep}>
          {currentStep === categories.length - 1 ? 'Submit' : 'Next'}
          {currentStep !== categories.length - 1 && <ChevronRight className="ml-2 h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
};

export default FollowUpForm;
