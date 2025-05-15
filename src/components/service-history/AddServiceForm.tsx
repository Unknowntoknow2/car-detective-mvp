
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface AddServiceFormProps {
  onSave: (data: any) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export const AddServiceForm: React.FC<AddServiceFormProps> = ({
  onSave,
  onCancel,
  isSubmitting
}) => {
  const [formData, setFormData] = React.useState({
    serviceType: '',
    date: new Date().toISOString().split('T')[0],
    mileage: '',
    description: '',
    cost: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Service Record</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="serviceType" className="text-sm font-medium">
                Service Type
              </label>
              <Input
                id="serviceType"
                name="serviceType"
                value={formData.serviceType}
                onChange={handleChange}
                placeholder="Oil Change, Tire Rotation, etc."
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="date" className="text-sm font-medium">
                Service Date
              </label>
              <Input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="mileage" className="text-sm font-medium">
                Mileage
              </label>
              <Input
                id="mileage"
                name="mileage"
                type="number"
                value={formData.mileage}
                onChange={handleChange}
                placeholder="Current mileage"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="cost" className="text-sm font-medium">
                Cost
              </label>
              <Input
                id="cost"
                name="cost"
                type="number"
                value={formData.cost}
                onChange={handleChange}
                placeholder="Service cost (optional)"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Details about the service performed"
              rows={3}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save Record'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default AddServiceForm;
