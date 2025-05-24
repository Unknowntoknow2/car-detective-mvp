
// src/components/lookup/followup/FollowUpForm.tsx

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from '@/hooks/use-toast';

interface FollowUpFormProps {
  onSubmit?: (data: FollowUpFormData) => void;
}

interface FollowUpFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
  sellingReason: string;
  timeline: string;
  hasCarfax: boolean;
  condition: string;
  financing: string;
}

const FollowUpForm: React.FC<FollowUpFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<FollowUpFormData>({
    name: '',
    email: '',
    phone: '',
    message: '',
    sellingReason: '',
    timeline: '',
    hasCarfax: false,
    condition: '',
    financing: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target as any;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { name, email, phone, message } = formData;

    if (!name || !email || !phone || !message) {
      toast({ 
        title: "Missing Information", 
        description: "Please fill out all required fields." 
      });
      return;
    }

    try {
      setLoading(true);
      await new Promise((res) => setTimeout(res, 1000));
      toast({ 
        title: "Message Sent", 
        description: "We will get back to you soon." 
      });

      onSubmit?.(formData);
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
        sellingReason: '',
        timeline: '',
        hasCarfax: false,
        condition: '',
        financing: '',
      });
    } catch (err) {
      toast({ 
        title: "Error", 
        description: "Failed to send message. Try again later."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-md">
      <CardHeader>
        <CardTitle>Tell Us More About Your Vehicle Needs</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="message">Brief Message or Questions</Label>
            <Textarea id="message" name="message" rows={4} value={formData.message} onChange={handleChange} required />
          </div>

          <div>
            <Label>Reason for Selling</Label>
            <Input name="sellingReason" value={formData.sellingReason} onChange={handleChange} placeholder="e.g. Upgrade, Emergency, Extra Vehicle" />
          </div>

          <div>
            <Label>Preferred Timeline</Label>
            <RadioGroup defaultValue={formData.timeline} onValueChange={(val) => setFormData((prev) => ({ ...prev, timeline: val }))}>
              <RadioGroupItem value="ASAP" id="asap" /> <Label htmlFor="asap">ASAP</Label>
              <RadioGroupItem value="1-2 Weeks" id="2weeks" /> <Label htmlFor="2weeks">1–2 Weeks</Label>
              <RadioGroupItem value="1 Month+" id="1month" /> <Label htmlFor="1month">More than a month</Label>
            </RadioGroup>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id="carfax" name="hasCarfax" checked={formData.hasCarfax} onCheckedChange={(val) => setFormData((prev) => ({ ...prev, hasCarfax: !!val }))} />
            <Label htmlFor="carfax">I have a CARFAX or service history</Label>
          </div>

          <div>
            <Label>Vehicle Condition</Label>
            <RadioGroup defaultValue={formData.condition} onValueChange={(val) => setFormData((prev) => ({ ...prev, condition: val }))}>
              <RadioGroupItem value="Excellent" id="excellent" /> <Label htmlFor="excellent">Excellent</Label>
              <RadioGroupItem value="Good" id="good" /> <Label htmlFor="good">Good</Label>
              <RadioGroupItem value="Fair" id="fair" /> <Label htmlFor="fair">Fair</Label>
              <RadioGroupItem value="Needs Work" id="work" /> <Label htmlFor="work">Needs Work</Label>
            </RadioGroup>
          </div>

          <div>
            <Label>Financing or Loan Status</Label>
            <Input name="financing" value={formData.financing} onChange={handleChange} placeholder="e.g. Paid off, Loan with XYZ bank" />
          </div>

          <Button type="submit" disabled={loading} className="mt-4">
            {loading ? 'Submitting...' : 'Submit Details'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default FollowUpForm;
