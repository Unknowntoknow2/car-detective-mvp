
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

interface UnifiedFollowUpFormProps {
  vin: string;
  onComplete: (formData: any) => void;
}

export function UnifiedFollowUpForm({ vin, onComplete }: UnifiedFollowUpFormProps) {
  const [formData, setFormData] = useState({
    zipCode: '',
    mileage: '',
    condition: '',
    hasAccidents: '',
    accidentDetails: '',
    titleStatus: 'clean',
    previousOwners: '1',
    serviceHistory: '',
    modifications: '',
    notes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.zipCode || !formData.mileage || !formData.condition) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    
    try {
      console.log('🔍 UnifiedFollowUpForm: Submitting follow-up data:', formData);
      
      // Here you would typically save to Supabase follow_up_answers table
      const followUpData = {
        vin,
        ...formData,
        completedAt: new Date().toISOString()
      };
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Follow-up questions completed!');
      onComplete(followUpData);
    } catch (error) {
      console.error('❌ UnifiedFollowUpForm: Error submitting:', error);
      toast.error('Failed to submit follow-up data');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = formData.zipCode && formData.mileage && formData.condition;

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-600" />
          Vehicle Details & Condition Assessment
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Please provide additional details to get the most accurate valuation for your vehicle.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="zipCode">ZIP Code *</Label>
              <Input
                id="zipCode"
                placeholder="Enter your ZIP code"
                value={formData.zipCode}
                onChange={(e) => handleInputChange('zipCode', e.target.value)}
                maxLength={5}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="mileage">Current Mileage *</Label>
              <Input
                id="mileage"
                type="number"
                placeholder="e.g., 75000"
                value={formData.mileage}
                onChange={(e) => handleInputChange('mileage', e.target.value)}
                required
              />
            </div>
          </div>

          {/* Vehicle Condition */}
          <div>
            <Label htmlFor="condition">Overall Condition *</Label>
            <Select value={formData.condition} onValueChange={(value) => handleInputChange('condition', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select vehicle condition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="excellent">Excellent - Like new, no visible wear</SelectItem>
                <SelectItem value="good">Good - Minor wear, well maintained</SelectItem>
                <SelectItem value="fair">Fair - Some wear, needs minor repairs</SelectItem>
                <SelectItem value="poor">Poor - Significant wear, needs major repairs</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Accident History */}
          <div>
            <Label htmlFor="hasAccidents">Accident History</Label>
            <Select value={formData.hasAccidents} onValueChange={(value) => handleInputChange('hasAccidents', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Has this vehicle been in any accidents?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="no">No accidents</SelectItem>
                <SelectItem value="minor">Minor accident (cosmetic damage only)</SelectItem>
                <SelectItem value="moderate">Moderate accident (structural damage repaired)</SelectItem>
                <SelectItem value="severe">Severe accident (major damage)</SelectItem>
              </SelectContent>
            </Select>
            
            {formData.hasAccidents && formData.hasAccidents !== 'no' && (
              <div className="mt-2">
                <Label htmlFor="accidentDetails">Accident Details</Label>
                <Textarea
                  id="accidentDetails"
                  placeholder="Please describe the accident and repairs..."
                  value={formData.accidentDetails}
                  onChange={(e) => handleInputChange('accidentDetails', e.target.value)}
                />
              </div>
            )}
          </div>

          {/* Title and Ownership */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="titleStatus">Title Status</Label>
              <Select value={formData.titleStatus} onValueChange={(value) => handleInputChange('titleStatus', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select title status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="clean">Clean Title</SelectItem>
                  <SelectItem value="salvage">Salvage Title</SelectItem>
                  <SelectItem value="rebuilt">Rebuilt Title</SelectItem>
                  <SelectItem value="flood">Flood Damage</SelectItem>
                  <SelectItem value="lemon">Lemon Title</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="previousOwners">Number of Previous Owners</Label>
              <Select value={formData.previousOwners} onValueChange={(value) => handleInputChange('previousOwners', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select number of owners" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Owner</SelectItem>
                  <SelectItem value="2">2 Owners</SelectItem>
                  <SelectItem value="3">3 Owners</SelectItem>
                  <SelectItem value="4+">4+ Owners</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Service History */}
          <div>
            <Label htmlFor="serviceHistory">Service History</Label>
            <Select value={formData.serviceHistory} onValueChange={(value) => handleInputChange('serviceHistory', value)}>
              <SelectTrigger>
                <SelectValue placeholder="How has the vehicle been maintained?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dealer">Dealer maintained with full records</SelectItem>
                <SelectItem value="independent">Independent shop with records</SelectItem>
                <SelectItem value="owner">Owner maintained</SelectItem>
                <SelectItem value="unknown">Unknown service history</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Modifications */}
          <div>
            <Label htmlFor="modifications">Modifications/Upgrades</Label>
            <Textarea
              id="modifications"
              placeholder="List any modifications, upgrades, or aftermarket parts..."
              value={formData.modifications}
              onChange={(e) => handleInputChange('modifications', e.target.value)}
            />
          </div>

          {/* Additional Notes */}
          <div>
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              placeholder="Any other details that might affect the vehicle's value..."
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <Button 
              type="submit" 
              disabled={!isFormValid || isSubmitting}
              className="w-full"
              size="lg"
            >
              {isSubmitting ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2 animate-spin" />
                  Processing Valuation...
                </>
              ) : (
                <>
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Get My Vehicle Valuation
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
