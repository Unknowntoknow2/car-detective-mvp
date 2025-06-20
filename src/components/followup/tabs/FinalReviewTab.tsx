
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, Info } from 'lucide-react';
import { FollowUpAnswers, AccidentDetails, ServiceHistoryDetails } from '@/types/follow-up-answers';

interface FinalReviewTabProps {
  formData: FollowUpAnswers;
  updateFormData: (updates: Partial<FollowUpAnswers>) => void;
}

export function FinalReviewTab({ formData }: FinalReviewTabProps) {
  // Type guards to safely access properties
  const getAccidentData = (): AccidentDetails => {
    if (typeof formData.accident_history === 'object' && formData.accident_history !== null) {
      return formData.accident_history;
    }
    return { 
      hadAccident: false, 
      count: 0, 
      severity: 'minor', 
      repaired: false, 
      frameDamage: false 
    };
  };

  const getServiceData = (): ServiceHistoryDetails => {
    if (typeof formData.serviceHistory === 'object' && formData.serviceHistory !== null) {
      return formData.serviceHistory;
    }
    return { hasRecords: false };
  };

  const accidentData = getAccidentData();
  const serviceData = getServiceData();

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
          <CheckCircle className="h-5 w-5 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Review & Submit</h2>
          <p className="text-gray-600">Please review your information before submitting</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Info className="h-5 w-5 mr-2" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">ZIP Code:</span>
              <span className="font-medium">{formData.zip_code || 'Not provided'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Mileage:</span>
              <span className="font-medium">{formData.mileage?.toLocaleString() || 'Not provided'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Condition:</span>
              <Badge variant="outline" className="capitalize">
                {formData.condition || 'Not specified'}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Transmission:</span>
              <span className="font-medium capitalize">{formData.transmission || 'Not specified'}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Accident History</CardTitle>
          </CardHeader>
          <CardContent>
            {accidentData.hadAccident ? (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4 text-orange-500" />
                  <span className="text-orange-700">Has accident history</span>
                </div>
                {accidentData.severity && (
                  <p className="text-sm text-gray-600">
                    Severity: {accidentData.severity}
                  </p>
                )}
                {accidentData.repaired !== undefined && (
                  <p className="text-sm text-gray-600">
                    Repaired: {accidentData.repaired ? 'Yes' : 'No'}
                  </p>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-green-700">No accident history</span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Service History</CardTitle>
          </CardHeader>
          <CardContent>
            {serviceData.hasRecords ? (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-green-700">Has service records</span>
                </div>
                {serviceData.lastService && (
                  <p className="text-sm text-gray-600">
                    Last Service: {serviceData.lastService}
                  </p>
                )}
                {serviceData.dealerMaintained !== undefined && (
                  <p className="text-sm text-gray-600">
                    Dealer Maintained: {serviceData.dealerMaintained ? 'Yes' : 'No'}
                  </p>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 text-orange-500" />
                <span className="text-orange-700">No service records</span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Vehicle Condition</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Exterior:</span>
              <Badge variant="outline" className="capitalize">
                {formData.exterior_condition || 'Not assessed'}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Interior:</span>
              <Badge variant="outline" className="capitalize">
                {formData.interior_condition || 'Not assessed'}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tires:</span>
              <Badge variant="outline" className="capitalize">
                {formData.tire_condition || 'Not assessed'}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Additional Notes</CardTitle>
        </CardHeader>
        <CardContent>
          {formData.additional_notes ? (
            <p className="text-gray-700">{formData.additional_notes}</p>
          ) : (
            <p className="text-gray-500 italic">No additional notes provided</p>
          )}
        </CardContent>
      </Card>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Ready to Submit</h3>
        <p className="text-blue-800">
          Your vehicle information has been reviewed. Click "Submit Valuation" to get your detailed vehicle valuation report.
        </p>
      </div>
    </div>
  );
}
