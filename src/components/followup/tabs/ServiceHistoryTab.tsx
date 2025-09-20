
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FollowUpAnswers, ServiceHistoryDetails } from '@/types/follow-up-answers';
import { Wrench, Calendar, FileText, Plus, X } from 'lucide-react';

interface ServiceHistoryTabProps {
  formData: FollowUpAnswers;
  updateFormData: (updates: Partial<FollowUpAnswers>) => void;
  onServiceHistoryChange?: (updates: Partial<FollowUpAnswers>) => void;
}

const maintenanceTypes = [
  'Oil Changes',
  'Brake Service',
  'Tire Rotation/Replacement',
  'Transmission Service',
  'Engine Tune-up',
  'Air Filter Replacement',
  'Battery Replacement',
  'Coolant Service',
  'Spark Plug Replacement',
  'Timing Belt/Chain',
  'Suspension Work',
  'AC/Heating Service'
];

const majorRepairTypes = [
  'Engine Rebuild/Replacement',
  'Transmission Rebuild/Replacement',
  'Major Electrical Work',
  'Suspension Overhaul',
  'Brake System Overhaul',
  'AC System Replacement',
  'Exhaust System Replacement',
  'Fuel System Repair',
  'Computer/ECU Replacement'
];

export function ServiceHistoryTab({ formData, updateFormData, onServiceHistoryChange }: ServiceHistoryTabProps) {
  const [newService, setNewService] = useState({ type: '', date: '', mileage: '', description: '' });
  
  const serviceHistory = formData.serviceHistory || {
    hasRecords: false,
    frequency: 'unknown',
    dealerMaintained: false,
    description: '',
    services: []
  };

  const updateServiceHistory = (updates: Partial<ServiceHistoryDetails>) => {
    const updatedData = { serviceHistory: { ...serviceHistory, ...updates } };
    updateFormData(updatedData);
    onServiceHistoryChange?.(updatedData);
  };

  const handleRecordsStatusChange = (hasRecords: string) => {
    const hasServiceRecords = hasRecords === 'yes';
    updateServiceHistory({
      hasRecords: hasServiceRecords,
      services: hasServiceRecords ? serviceHistory.services : [],
      description: hasServiceRecords ? serviceHistory.description : '',
      frequency: hasServiceRecords ? serviceHistory.frequency : 'unknown',
      dealerMaintained: hasServiceRecords ? serviceHistory.dealerMaintained : false
    });
  };

  const addService = () => {
    if (newService.type && newService.date) {
      const updatedServices = [...(serviceHistory.services || []), { ...newService }];
      updateServiceHistory({ services: updatedServices });
      setNewService({ type: '', date: '', mileage: '', description: '' });
    }
  };

  const removeService = (index: number) => {
    const updatedServices = (serviceHistory.services || []).filter((_, i) => i !== index);
    updateServiceHistory({ services: updatedServices });
  };

  return (
    <div className="space-y-6">
      {/* Service Records Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-500" />
            Service Records Available
          </CardTitle>
          <p className="text-sm text-gray-600">
            Do you have maintenance and service records for this vehicle?
          </p>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={serviceHistory.hasRecords ? 'yes' : 'no'}
            onValueChange={handleRecordsStatusChange}
            className="flex gap-6"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="has-records" />
              <Label htmlFor="has-records" className="font-medium">Yes, I have service records</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="no-records" />
              <Label htmlFor="no-records" className="font-medium">No records available</Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {serviceHistory.hasRecords && (
        <>
          {/* Maintenance Pattern */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-green-500" />
                Maintenance Pattern
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="maintenance-frequency">Maintenance Frequency</Label>
                  <Select
                    value={serviceHistory.frequency}
                    onValueChange={(value: 'regular' | 'occasional' | 'rare' | 'unknown') => 
                      updateServiceHistory({ frequency: value })
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="regular">Regular (every 3-6 months)</SelectItem>
                      <SelectItem value="occasional">Occasional (every 6-12 months)</SelectItem>
                      <SelectItem value="rare">Rare (only when needed)</SelectItem>
                      <SelectItem value="unknown">Unknown</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <Label className="font-medium">Dealer Maintained</Label>
                    <p className="text-sm text-gray-600">Primarily serviced at authorized dealers</p>
                  </div>
                  <Checkbox
                    checked={serviceHistory.dealerMaintained}
                    onCheckedChange={(checked) => 
                      updateServiceHistory({ dealerMaintained: checked as boolean })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Service History Entry */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="w-5 h-5 text-orange-500" />
                Service History
              </CardTitle>
              <p className="text-sm text-gray-600">
                Add specific service and maintenance records
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add New Service */}
              <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
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
                        <optgroup label="Regular Maintenance">
                          {maintenanceTypes.map(type => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </optgroup>
                        <optgroup label="Major Repairs">
                          {majorRepairTypes.map(type => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </optgroup>
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
                  
                  <div className="flex items-end">
                    <Button onClick={addService} className="w-full">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Service
                    </Button>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="service-description">Description (Optional)</Label>
                  <Input
                    id="service-description"
                    placeholder="Additional details about the service"
                    value={newService.description}
                    onChange={(e) => setNewService(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>
              </div>

              {/* Service History List */}
              {serviceHistory.services && serviceHistory.services.length > 0 && (
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Service Records</Label>
                  {serviceHistory.services.map((service, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{service.type}</Badge>
                          <span className="text-sm text-gray-600">{service.date}</span>
                          {service.mileage && (
                            <span className="text-sm text-gray-500">@ {service.mileage} miles</span>
                          )}
                        </div>
                        {service.description && (
                          <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeService(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* General Service Description */}
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
                value={serviceHistory.description || ''}
                onChange={(e) => updateServiceHistory({ description: e.target.value })}
                rows={4}
                className="w-full"
              />
            </CardContent>
          </Card>
        </>
      )}

      {/* No Records Available */}
      {!serviceHistory.hasRecords && (
        <Card>
          <CardHeader>
            <CardTitle>Maintenance Estimate</CardTitle>
            <p className="text-sm text-gray-600">
              Even without records, you can provide general information about the vehicle's maintenance
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="estimated-frequency">Estimated Maintenance Frequency</Label>
                <Select
                  value={serviceHistory.frequency}
                  onValueChange={(value: 'regular' | 'occasional' | 'rare' | 'unknown') => 
                    updateServiceHistory({ frequency: value })
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="regular">Well maintained</SelectItem>
                    <SelectItem value="occasional">Moderately maintained</SelectItem>
                    <SelectItem value="rare">Minimally maintained</SelectItem>
                    <SelectItem value="unknown">Unknown</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="general-description">General Condition Notes</Label>
                <Textarea
                  id="general-description"
                  placeholder="Describe any known maintenance issues, recent services, or general condition observations..."
                  value={serviceHistory.description || ''}
                  onChange={(e) => updateServiceHistory({ description: e.target.value })}
                  rows={3}
                  className="w-full"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
