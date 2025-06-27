
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Plus, Trash2, Wrench, Calendar, FileText } from 'lucide-react';
import { FollowUpAnswers } from '@/types/follow-up-answers';

interface ServiceMaintenanceTabProps {
  formData: FollowUpAnswers;
  updateFormData: (updates: Partial<FollowUpAnswers>) => void;
}

const serviceTypes = [
  'Oil Change',
  'Brake Service',
  'Tire Rotation/Replacement',
  'Transmission Service',
  'Engine Service',
  'Electrical Repair',
  'AC/Heating Service',
  'Battery Replacement',
  'Suspension Work',
  'Exhaust Repair',
  'Other'
];

export function ServiceMaintenanceTab({ formData, updateFormData }: ServiceMaintenanceTabProps) {
  const [newService, setNewService] = useState({
    type: '',
    date: '',
    mileage: '',
    description: ''
  });

  const handleServiceRecordsChange = (value: string) => {
    const hasRecords = value === 'yes';
    updateFormData({
      serviceHistory: {
        ...formData.serviceHistory,
        hasRecords,
        services: hasRecords ? (formData.serviceHistory?.services || []) : []
      }
    });
  };

  const handleMaintenanceFrequencyChange = (value: string) => {
    updateFormData({
      serviceHistory: {
        ...formData.serviceHistory,
        frequency: value as any,
        hasRecords: formData.serviceHistory?.hasRecords || false,
        dealerMaintained: formData.serviceHistory?.dealerMaintained || false,
        description: formData.serviceHistory?.description || '',
        services: formData.serviceHistory?.services || []
      }
    });
  };

  const handleDealerMaintenanceChange = (value: string) => {
    updateFormData({
      serviceHistory: {
        ...formData.serviceHistory,
        dealerMaintained: value === 'yes',
        hasRecords: formData.serviceHistory?.hasRecords || false,
        frequency: formData.serviceHistory?.frequency || 'unknown',
        description: formData.serviceHistory?.description || '',
        services: formData.serviceHistory?.services || []
      }
    });
  };

  const addService = () => {
    if (newService.type && newService.date) {
      const services = formData.serviceHistory?.services || [];
      updateFormData({
        serviceHistory: {
          ...formData.serviceHistory,
          services: [...services, { ...newService }],
          hasRecords: formData.serviceHistory?.hasRecords || false,
          frequency: formData.serviceHistory?.frequency || 'unknown',
          dealerMaintained: formData.serviceHistory?.dealerMaintained || false,
          description: formData.serviceHistory?.description || ''
        }
      });
      setNewService({ type: '', date: '', mileage: '', description: '' });
    }
  };

  const removeService = (index: number) => {
    const services = formData.serviceHistory?.services || [];
    const updatedServices = services.filter((_, i) => i !== index);
    updateFormData({
      serviceHistory: {
        ...formData.serviceHistory,
        services: updatedServices,
        hasRecords: formData.serviceHistory?.hasRecords || false,
        frequency: formData.serviceHistory?.frequency || 'unknown',
        dealerMaintained: formData.serviceHistory?.dealerMaintained || false,
        description: formData.serviceHistory?.description || ''
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Service Records Available */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Service Records Available
          </CardTitle>
          <p className="text-sm text-gray-600">
            Do you have maintenance and service records for this vehicle?
          </p>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={formData.serviceHistory?.hasRecords ? 'yes' : 'no'}
            onValueChange={handleServiceRecordsChange}
            className="grid grid-cols-2 gap-4"
          >
            <div className="flex items-center space-x-2 border rounded-lg p-4">
              <RadioGroupItem value="yes" id="records-yes" />
              <Label htmlFor="records-yes" className="cursor-pointer">
                <div>
                  <div className="font-medium">Yes, I have service records</div>
                  <div className="text-sm text-gray-500">Complete maintenance history available</div>
                </div>
              </Label>
            </div>
            <div className="flex items-center space-x-2 border rounded-lg p-4">
              <RadioGroupItem value="no" id="records-no" />
              <Label htmlFor="records-no" className="cursor-pointer">
                <div>
                  <div className="font-medium">No records available</div>
                  <div className="text-sm text-gray-500">Limited or no service documentation</div>
                </div>
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Maintenance Pattern */}
      {formData.serviceHistory?.hasRecords && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Maintenance Pattern
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium mb-3 block">Maintenance Frequency</Label>
                <Select 
                  value={formData.serviceHistory?.frequency || 'unknown'} 
                  onValueChange={handleMaintenanceFrequencyChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="regular">Regular - On schedule</SelectItem>
                    <SelectItem value="occasional">Occasional - Some delays</SelectItem>
                    <SelectItem value="rare">Rare - Minimal maintenance</SelectItem>
                    <SelectItem value="unknown">Unknown</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium mb-3 block">Dealer Maintained</Label>
                <RadioGroup
                  value={formData.serviceHistory?.dealerMaintained ? 'yes' : 'no'}
                  onValueChange={handleDealerMaintenanceChange}
                  className="flex space-x-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="dealer-yes" />
                    <Label htmlFor="dealer-yes">Primarily serviced at authorized dealers</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="dealer-no" />
                    <Label htmlFor="dealer-no">Independent shops or DIY</Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>

          {/* Service History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="w-5 h-5" />
                Service History
              </CardTitle>
              <p className="text-sm text-gray-600">
                Add specific service and maintenance records
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add Service Form */}
              <div className="border rounded-lg p-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="service-type">Service Type</Label>
                    <Select 
                      value={newService.type} 
                      onValueChange={(value) => setNewService(prev => ({ ...prev, type: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select service" />
                      </SelectTrigger>
                      <SelectContent>
                        {serviceTypes.map((type) => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="service-date">Service Date</Label>
                    <Input
                      id="service-date"
                      type="date"
                      value={newService.date}
                      onChange={(e) => setNewService(prev => ({ ...prev, date: e.target.value }))}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="service-mileage">Mileage</Label>
                  <Input
                    id="service-mileage"
                    type="number"
                    placeholder="Miles"
                    value={newService.mileage}
                    onChange={(e) => setNewService(prev => ({ ...prev, mileage: e.target.value }))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="service-description">Description (Optional)</Label>
                  <Textarea
                    id="service-description"
                    placeholder="Additional details about the service"
                    value={newService.description}
                    onChange={(e) => setNewService(prev => ({ ...prev, description: e.target.value }))}
                    rows={2}
                  />
                </div>
                
                <Button onClick={addService} className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Service
                </Button>
              </div>

              {/* Service List */}
              {formData.serviceHistory?.services && formData.serviceHistory.services.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">Recorded Services</h4>
                  {formData.serviceHistory.services.map((service, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium">{service.type}</div>
                        <div className="text-sm text-gray-600">
                          {service.date} {service.mileage && `• ${service.mileage} miles`}
                        </div>
                        {service.description && (
                          <div className="text-sm text-gray-500 mt-1">{service.description}</div>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeService(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Additional Service Information */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Service Information</CardTitle>
              <p className="text-sm text-gray-600">
                Provide any additional details about the vehicle's maintenance history
              </p>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Include information about: warranty coverage, extended service plans, recalls completed, major component replacements, preventive maintenance schedules, etc."
                value={formData.serviceHistory?.description || ''}
                onChange={(e) => updateFormData({
                  serviceHistory: {
                    ...formData.serviceHistory,
                    description: e.target.value,
                    hasRecords: formData.serviceHistory?.hasRecords || false,
                    frequency: formData.serviceHistory?.frequency || 'unknown',
                    dealerMaintained: formData.serviceHistory?.dealerMaintained || false,
                    services: formData.serviceHistory?.services || []
                  }
                })}
                rows={4}
                className="w-full"
              />
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
