
import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useReferrals } from '@/contexts/ReferralContext';
import { Mail, Copy, Link, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface ReferralModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ReferralModal({ isOpen, onClose }: ReferralModalProps) {
  const { myReferralToken, generateReferralLink } = useReferrals();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const linkRef = useRef<HTMLInputElement>(null);
  
  const referralUrl = myReferralToken 
    ? `${window.location.origin}/signup?ref=${myReferralToken}`
    : '';

  const handleCopyLink = () => {
    if (linkRef.current) {
      linkRef.current.select();
      document.execCommand('copy');
      toast.success('Referral link copied to clipboard');
    }
  };

  const handleSendEmail = async () => {
    if (!email) {
      toast.error('Please enter an email address');
      return;
    }

    setIsLoading(true);
    try {
      // First ensure we have a referral token
      const token = myReferralToken || await generateReferralLink(email);
      
      // Then send the invitation email
      const { error } = await supabase.functions.invoke('send-referral-email', {
        body: {
          type: 'invite',
          referralToken: token,
          referredEmail: email
        }
      });
      
      if (error) throw error;
      
      toast.success('Invitation sent successfully');
      setEmail('');
      onClose();
    } catch (error) {
      console.error('Error sending invitation:', error);
      toast.error('Failed to send invitation');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Refer a Friend</DialogTitle>
          <DialogDescription>
            Invite friends to Car Detective and earn rewards when they use the platform
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="email" className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email
            </TabsTrigger>
            <TabsTrigger value="link" className="flex items-center gap-2">
              <Link className="h-4 w-4" />
              Copy Link
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="email" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="email">Friend's Email</Label>
              <Input
                id="email"
                placeholder="friend@example.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div className="bg-muted/50 p-4 rounded-md text-sm">
              <h4 className="font-medium flex items-center gap-2 mb-2">
                <Users className="h-4 w-4" />
                Reward Program
              </h4>
              <p>Your friend will receive an email with your invitation. You'll earn:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>$5 when they complete their first valuation</li>
                <li>$10 when they purchase a premium report</li>
              </ul>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={onClose}>Cancel</Button>
              <Button 
                onClick={handleSendEmail} 
                disabled={isLoading || !email}
              >
                {isLoading ? 'Sending...' : 'Send Invitation'}
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="link" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="referral-link">Your Referral Link</Label>
              <div className="flex">
                <Input
                  id="referral-link"
                  value={referralUrl}
                  readOnly
                  ref={linkRef}
                  className="flex-1"
                />
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="ml-2"
                  onClick={handleCopyLink}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="bg-muted/50 p-4 rounded-md text-sm">
              <h4 className="font-medium flex items-center gap-2 mb-2">
                <Users className="h-4 w-4" />
                How to Share
              </h4>
              <p>Share your unique link with friends through:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Social media</li>
                <li>Messaging apps</li>
                <li>Forums and communities</li>
              </ul>
            </div>
            
            <div className="flex justify-end">
              <Button variant="outline" onClick={onClose}>Close</Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
