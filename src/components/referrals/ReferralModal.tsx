
import React, { useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Copy, Share2 } from "lucide-react";
import { toast } from "sonner";

interface ReferralModalProps {
  isOpen: boolean;
  onClose: () => void;
  referralCode: string;
}

export function ReferralModal({ isOpen, onClose, referralCode }: ReferralModalProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const referralLink = `${window.location.origin}?ref=${referralCode}`;

  const copyToClipboard = () => {
    if (inputRef.current) {
      inputRef.current.select();
      document.execCommand('copy');
      toast.success("Referral link copied to clipboard!");
    }
  };

  const shareLink = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Car Detective - Free Vehicle Valuations',
          text: 'Get free vehicle valuations with Car Detective!',
          url: referralLink,
        });
      } catch (error) {
      }
    } else {
      copyToClipboard();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Car Detective</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Share your referral link and earn rewards when friends sign up!
          </p>
          <div className="flex items-center space-x-2">
            <Input
              id="referral-link"
              value={referralLink}
              readOnly
              ref={inputRef}
              className="flex-1"
            />
            <Button type="button" size="sm" onClick={copyToClipboard}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex justify-center space-x-2">
            <Button onClick={shareLink} className="flex-1">
              <Share2 className="h-4 w-4 mr-2" />
              Share Link
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
