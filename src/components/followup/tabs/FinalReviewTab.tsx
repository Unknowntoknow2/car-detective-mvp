
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, FileText, AlertCircle } from 'lucide-react';
import { FollowUpAnswers } from '@/types/follow-up-answers';

interface FinalReviewTabProps {
  formData: FollowUpAnswers;
  updateFormData: (updates: Partial<FollowUpAnswers>) => void;
  onSubmit?: () => void;
  isLoading?: boolean;
}

export function FinalReviewTab({ formData, updateFormData, onSubmit, isLoading }: FinalReviewTabProps) {
  const getSummaryData = () => {
    const summary = [];
    
    // Basic Info
    summary.push({
      category: 'Basic Information',
      items: [
        { label: 'VIN', value: formData.vin },
        { label: 'Zip Code', value: formData.zip_code },
        { label: 'Mileage', value: formData.mileage?.toLocaleString() || 'Not specified' },
        { label: 'Condition', value: formData.condition },
        { label: 'Transmission', value: formData.transmission }
      ]
    });

    // Title & Ownership
    if (formData.title_status || formData.previous_owners) {
      summary.push({
        category: 'Title & Ownership',
        items: [
          { label: 'Title Status', value: formData.title_status || 'Not specified' },
          { label: 'Previous Owners', value: formData.previous_owners?.toString() || 'Not specified' }
        ]
      });
    }

    // Vehicle Condition
    if (formData.exterior_condition || formData.interior_condition || formData.tire_condition) {
      summary.push({
        category: 'Vehicle Condition',
        items: [
          { label: 'Exterior', value: formData.exterior_condition || 'Not specified' },
          { label: 'Interior', value: formData.interior_condition || 'Not specified' },
          { label: 'Tires', value: formData.tire_condition || 'Not specified' },
          { label: 'Dashboard Lights', value: formData.dashboard_lights?.length ? `${formData.dashboard_lights.length} warning(s)` : 'None' }
        ]
      });
    }

    // Accident History
    if (formData.accident_history) {
      summary.push({
        category: 'Accident History',
        items: [
          { label: 'Has Accidents', value: formData.accident_history.hadAccident ? 'Yes' : 'No' },
          ...(formData.accident_history.hadAccident ? [
            { label: 'Severity', value: formData.accident_history.severity || 'Not specified' },
            { label: 'Repaired', value: formData.accident_history.repaired ? 'Yes' : 'No' }
          ] : [])
        ]
      });
    }

    // Service History
    if (formData.serviceHistory) {
      summary.push({
        category: 'Service History',
        items: [
          { label: 'Has Records', value: formData.serviceHistory.hasRecords ? 'Yes' : 'No' },
          ...(formData.serviceHistory.hasRecords ? [
            { label: 'Last Service', value: formData.serviceHistory.lastService || 'Not specified' },
            { label: 'Dealer Maintained', value: formData.serviceHistory.dealerMaintained ? 'Yes' : 'No' }
          ] : [])
        ]
      });
    }

    // Features
    if (formData.features && formData.features.length > 0) {
      summary.push({
        category: 'Features',
        items: [
          { label: 'Selected Features', value: `${formData.features.length} feature(s)` }
        ]
      });
    }

    return summary;
  };

  const getCompletionStatus = () => {
    const required = ['vin', 'zip_code', 'mileage', 'condition'];
    const completed = required.filter(field => formData[field as keyof FollowUpAnswers]);
    return {
      completed: completed.length,
      total: required.length,
      percentage: Math.round((completed.length / required.length) * 100)
    };
  };

  const status = getCompletionStatus();
  const summaryData = getSummaryData();

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-3 mb-8">
        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
          <FileText className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Review & Submit</h2>
          <p className="text-gray-600 text-lg">Review your information before submission</p>
        </div>
      </div>

      {/* Completion Status */}
      <Card className={status.percentage === 100 ? "border-green-200 bg-green-50" : "border-yellow-200 bg-yellow-50"}>
        <CardHeader>
          <CardTitle className="flex items-center">
            {status.percentage === 100 ? (
              <CheckCircle className="h-6 w-6 text-green-600 mr-2" />
            ) : (
              <AlertCircle className="h-6 w-6 text-yellow-600 mr-2" />
            )}
            Form Completion Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <span className={status.percentage === 100 ? "text-green-700" : "text-yellow-700"}>
              {status.completed} of {status.total} required fields completed
            </span>
            <Badge variant={status.percentage === 100 ? "default" : "secondary"}>
              {status.percentage}% Complete
            </Badge>
          </div>
          {status.percentage < 100 && (
            <p className="text-sm text-yellow-600 mt-2">
              Please complete all required fields to submit your valuation.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {summaryData.map((section, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="text-lg">{section.category}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {section.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex justify-between">
                    <span className="text-gray-600">{item.label}:</span>
                    <span className="font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Additional Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <Label htmlFor="additional_notes">
            Any additional information about your vehicle?
          </Label>
          <Textarea
            id="additional_notes"
            placeholder="Please share any additional details that might affect the valuation..."
            value={formData.additional_notes || ''}
            onChange={(e) => updateFormData({ additional_notes: e.target.value })}
            rows={4}
            className="mt-2"
          />
          <p className="text-sm text-gray-500 mt-2">
            Optional: Include any unique features, recent repairs, or other relevant information.
          </p>
        </CardContent>
      </Card>

      {/* Submission Info */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-6">
          <div className="flex items-start space-x-3">
            <CheckCircle className="h-6 w-6 text-blue-600 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-blue-800">Ready to Submit</h3>
              <p className="text-blue-700 mt-1">
                Once submitted, we'll process your information and provide a detailed valuation report.
                You can save your progress at any time and return later to complete the form.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
