import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  Circle, 
  ArrowRight, 
  ArrowLeft, 
  Send,
  Clock,
  AlertCircle,
  MapPin,
  Car,
  Wrench,
  AlertTriangle,
  Settings,
  Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface StepData {
  id: string;
  title: string;
  description: string;
  icon: any;
  required: boolean;
  completed: boolean;
  component: React.ComponentType<any>;
}

interface LinearProgressStepperProps {
  steps: StepData[];
  currentStep: string;
  formData: any;
  updateFormData: (data: any) => void;
  onStepChange: (stepId: string) => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
  canSubmit?: boolean;
  completionPercentage: number;
}

export function LinearProgressStepper({
  steps,
  currentStep,
  formData,
  updateFormData,
  onStepChange,
  onSubmit,
  isSubmitting = false,
  canSubmit = false,
  completionPercentage
}: LinearProgressStepperProps) {
  const currentStepIndex = steps.findIndex(step => step.id === currentStep);
  const currentStepData = steps[currentStepIndex];

  const getStepStatus = (step: StepData, index: number) => {
    if (step.completed) return 'completed';
    if (index === currentStepIndex) return 'current';
    if (index < currentStepIndex) return 'visited';
    return 'upcoming';
  };

  const getStepIcon = (step: StepData, status: string) => {
    if (status === 'completed') return CheckCircle;
    if (status === 'current') return step.icon;
    return Circle;
  };

  const getStepColors = (status: string, required: boolean) => {
    switch (status) {
      case 'completed':
        return {
          bg: 'bg-green-100',
          border: 'border-green-300',
          text: 'text-green-700',
          icon: 'text-green-600'
        };
      case 'current':
        return {
          bg: 'bg-blue-100',
          border: 'border-blue-300',
          text: 'text-blue-700',
          icon: 'text-blue-600'
        };
      case 'visited':
        return {
          bg: 'bg-gray-100',
          border: 'border-gray-300',
          text: 'text-gray-700',
          icon: 'text-gray-600'
        };
      default:
        return {
          bg: required ? 'bg-amber-50' : 'bg-gray-50',
          border: required ? 'border-amber-200' : 'border-gray-200',
          text: required ? 'text-amber-700' : 'text-gray-600',
          icon: required ? 'text-amber-600' : 'text-gray-400'
        };
    }
  };

  const goToPrevious = () => {
    if (currentStepIndex > 0) {
      onStepChange(steps[currentStepIndex - 1].id);
    }
  };

  const goToNext = () => {
    if (currentStepIndex < steps.length - 1) {
      onStepChange(steps[currentStepIndex + 1].id);
    }
  };

  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === steps.length - 1;

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Title and Progress */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">Improve Your Valuation Accuracy</h2>
                <p className="text-sm text-muted-foreground">
                  Answer a few more questions to get the most precise estimate possible
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary">{completionPercentage}%</div>
                <div className="text-sm text-muted-foreground">Complete</div>
              </div>
            </div>

            {/* Progress Bar */}
            <Progress value={completionPercentage} className="h-2" />

            {/* Step Navigation Breadcrumbs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {steps.map((step, index) => {
                const status = getStepStatus(step, index);
                const colors = getStepColors(status, step.required);
                const StepIcon = getStepIcon(step, status);

                return (
                  <motion.button
                    key={step.id}
                    onClick={() => onStepChange(step.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all ${colors.bg} ${colors.border} ${colors.text} hover:scale-105`}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <StepIcon className={`w-4 h-4 ${colors.icon}`} />
                    <span className="text-sm font-medium whitespace-nowrap">{step.title}</span>
                    {step.required && (
                      <Badge variant="outline" className="text-xs py-0 px-1">Req</Badge>
                    )}
                    {status === 'completed' && (
                      <CheckCircle className="w-3 h-3 text-green-600" />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardContent className="p-6">
              {/* Step Header */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`p-2 rounded-lg ${getStepColors(getStepStatus(currentStepData, currentStepIndex), currentStepData.required).bg}`}>
                    <currentStepData.icon className={`w-5 h-5 ${getStepColors(getStepStatus(currentStepData, currentStepIndex), currentStepData.required).icon}`} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{currentStepData.title}</h3>
                    <p className="text-sm text-muted-foreground">{currentStepData.description}</p>
                  </div>
                  {currentStepData.required && (
                    <Badge variant="outline" className="ml-auto">Required</Badge>
                  )}
                </div>
                
                {/* Step Progress */}
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>Step {currentStepIndex + 1} of {steps.length}</span>
                  <span>•</span>
                  <span>{Math.round(((currentStepIndex + 1) / steps.length) * 100)}% through steps</span>
                </div>
              </div>

              {/* Step Component */}
              <currentStepData.component
                formData={formData}
                updateFormData={updateFormData}
              />
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            {/* Left Side - Previous */}
            <div>
              {!isFirstStep && (
                <Button
                  variant="outline"
                  onClick={goToPrevious}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Previous
                </Button>
              )}
            </div>

            {/* Right Side - Next/Submit */}
            <div className="flex items-center gap-3">
              {/* Progress Indicator */}
              <div className="text-sm text-muted-foreground">
                {currentStepIndex + 1} / {steps.length}
              </div>

              {/* Action Button */}
              {!isLastStep ? (
                <Button
                  onClick={goToNext}
                  className="flex items-center gap-2"
                >
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  onClick={onSubmit}
                  disabled={!canSubmit || isSubmitting}
                  className={`flex items-center gap-2 ${
                    canSubmit 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Complete Valuation
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>

          {/* Completion Status */}
          {isLastStep && !canSubmit && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg"
            >
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-amber-800">Complete Required Steps</p>
                  <p className="text-amber-700">
                    Please fill in the required information in the Basic Info and Condition steps to enable the Complete Valuation button.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}