
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface Props {
  vin: string;
}

export function FollowUpForm({ vin }: Props) {
  const { user } = useAuth();
  const [form, setForm] = useState({
    mileage: '',
    zip_code: '',
    condition_level: '',
    accident: '',
    accident_severity: '',
    accident_area: '',
    service_history: '',
    title_status: '',
    tire_condition: '',
    number_of_owners: '',
    previous_use: '',
    modified: '',
    frame_damage: '',
    dashboard_lights: '',
    maintenance_up_to_date: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (name: string, value: string) => {
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to submit your valuation details.",
        variant: "destructive"
      });
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('valuation_responses')
        .insert([{ 
          ...form, 
          vin,
          user_id: user.id,
          mileage: form.mileage ? parseInt(form.mileage) : null
        }]);

      if (error) throw error;

      setSubmitted(true);
      toast({
        title: "Success!",
        description: "Your valuation details have been submitted successfully."
      });
    } catch (error: any) {
      console.error('Error submitting form:', error);
      toast({
        title: "Error",
        description: "Failed to submit valuation details. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-green-600 mb-2">
              Thank you! Your answers were submitted.
            </h3>
            <p className="text-muted-foreground">
              We're now processing your valuation with enhanced accuracy.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Complete Your Valuation</CardTitle>
        <p className="text-muted-foreground">
          Please provide additional details to get a more accurate valuation.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="mileage">Mileage</Label>
            <Input
              id="mileage"
              type="number"
              placeholder="Enter current mileage"
              value={form.mileage}
              onChange={(e) => handleInputChange('mileage', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="zip_code">ZIP Code</Label>
            <Input
              id="zip_code"
              placeholder="Enter ZIP code"
              value={form.zip_code}
              onChange={(e) => handleInputChange('zip_code', e.target.value)}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="condition_level">Overall Condition</Label>
          <Select value={form.condition_level} onValueChange={(value) => handleInputChange('condition_level', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select overall condition" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Excellent">Excellent</SelectItem>
              <SelectItem value="Good">Good</SelectItem>
              <SelectItem value="Fair">Fair</SelectItem>
              <SelectItem value="Poor">Poor</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="accident">Any Accidents?</Label>
          <Select value={form.accident} onValueChange={(value) => handleInputChange('accident', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Has the vehicle been in any accidents?" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="yes">Yes</SelectItem>
              <SelectItem value="no">No</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {form.accident === 'yes' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="accident_severity">Accident Severity</Label>
              <Select value={form.accident_severity} onValueChange={(value) => handleInputChange('accident_severity', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Minor">Minor</SelectItem>
                  <SelectItem value="Moderate">Moderate</SelectItem>
                  <SelectItem value="Major">Major</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="accident_area">Impact Area</Label>
              <Select value={form.accident_area} onValueChange={(value) => handleInputChange('accident_area', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select impact area" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Rear">Rear</SelectItem>
                  <SelectItem value="Front">Front</SelectItem>
                  <SelectItem value="Left">Left</SelectItem>
                  <SelectItem value="Right">Right</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="service_history">Service History</Label>
            <Select value={form.service_history} onValueChange={(value) => handleInputChange('service_history', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select service history" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="On-time">On-time</SelectItem>
                <SelectItem value="Late">Late</SelectItem>
                <SelectItem value="No history">No history</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="title_status">Title Status</Label>
            <Select value={form.title_status} onValueChange={(value) => handleInputChange('title_status', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select title status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Clean">Clean</SelectItem>
                <SelectItem value="Salvage">Salvage</SelectItem>
                <SelectItem value="Branded">Branded</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="tire_condition">Tire Condition</Label>
            <Select value={form.tire_condition} onValueChange={(value) => handleInputChange('tire_condition', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select tire condition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Excellent">Excellent</SelectItem>
                <SelectItem value="Fair">Fair</SelectItem>
                <SelectItem value="Worn">Worn</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="number_of_owners">Previous Owners</Label>
            <Select value={form.number_of_owners} onValueChange={(value) => handleInputChange('number_of_owners', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select number of owners" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1</SelectItem>
                <SelectItem value="2">2</SelectItem>
                <SelectItem value="3+">3+</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="previous_use">Previous Use</Label>
            <Select value={form.previous_use} onValueChange={(value) => handleInputChange('previous_use', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select previous use" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Personal">Personal</SelectItem>
                <SelectItem value="Fleet">Fleet</SelectItem>
                <SelectItem value="Rental">Rental</SelectItem>
                <SelectItem value="Unknown">Unknown</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="modified">Modified?</Label>
            <Select value={form.modified} onValueChange={(value) => handleInputChange('modified', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Has the vehicle been modified?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="frame_damage">Frame Damage?</Label>
            <Select value={form.frame_damage} onValueChange={(value) => handleInputChange('frame_damage', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Any frame damage?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="dashboard_lights">Dashboard Lights</Label>
            <Select value={form.dashboard_lights} onValueChange={(value) => handleInputChange('dashboard_lights', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Any warning lights?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="None">None</SelectItem>
                <SelectItem value="Check Engine">Check Engine</SelectItem>
                <SelectItem value="Airbag">Airbag</SelectItem>
                <SelectItem value="ABS">ABS</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="maintenance_up_to_date">Maintenance Up To Date?</Label>
          <Select value={form.maintenance_up_to_date} onValueChange={(value) => handleInputChange('maintenance_up_to_date', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Is maintenance current?" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="yes">Yes</SelectItem>
              <SelectItem value="no">No</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button 
          onClick={handleSubmit} 
          disabled={submitting} 
          className="w-full"
        >
          {submitting ? 'Submitting...' : 'Submit Valuation Details'}
        </Button>
      </CardContent>
    </Card>
  );
}
