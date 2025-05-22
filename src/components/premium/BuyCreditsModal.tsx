
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { 
  checkoutSingleReport,
  checkoutBundle3Reports,
  checkoutBundle5Reports 
} from '@/utils/stripeService';
import { toast } from 'sonner';
import { 
  CreditCard, 
  Package, 
  PackageCheck, 
  Loader2, 
  X
} from 'lucide-react';

interface BuyCreditsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  valuationId?: string;
}

export function BuyCreditsModal({ open, onOpenChange, valuationId }: BuyCreditsModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBundle, setSelectedBundle] = useState<'single' | 'bundle_3' | 'bundle_5' | null>(null);

  const handleCheckout = async (bundle: 'single' | 'bundle_3' | 'bundle_5') => {
    setSelectedBundle(bundle);
    setIsLoading(true);
    
    try {
      let response;
      
      if (bundle === 'bundle_3') {
        response = await checkoutBundle3Reports({ valuationId });
      } else if (bundle === 'bundle_5') {
        response = await checkoutBundle5Reports({ valuationId });
      } else {
        response = await checkoutSingleReport({ valuationId });
      }
      
      if (response.success && response.url) {
        window.location.href = response.url;
      } else {
        toast.error(response.error || 'Could not create checkout session');
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast.error('Failed to start checkout process');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Purchase Premium Credits</DialogTitle>
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-4 top-4" 
            onClick={() => onOpenChange(false)}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <div className="space-y-2">
            <div className={`border p-4 rounded-lg ${selectedBundle === 'single' ? 'border-primary bg-primary/5' : ''} hover:border-primary/50 cursor-pointer transition-colors`}
                 onClick={() => !isLoading && setSelectedBundle('single')}>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium flex items-center">
                    <CreditCard className="h-4 w-4 mr-2 text-primary" />
                    Single Report
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Get detailed insights for one vehicle
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-bold">$19.99</span>
                </div>
              </div>
              <Button
                className="mt-3 w-full"
                disabled={isLoading}
                onClick={(e) => {
                  e.stopPropagation();
                  handleCheckout('single');
                }}
              >
                {isLoading && selectedBundle === 'single' ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</>
                ) : (
                  'Buy Now'
                )}
              </Button>
            </div>
            
            <div className={`border p-4 rounded-lg ${selectedBundle === 'bundle_3' ? 'border-primary bg-primary/5' : ''} hover:border-primary/50 cursor-pointer transition-colors`}
                 onClick={() => !isLoading && setSelectedBundle('bundle_3')}>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium flex items-center">
                    <Package className="h-4 w-4 mr-2 text-primary" />
                    3-Pack Bundle <span className="ml-2 text-xs px-2 py-0.5 bg-green-100 text-green-800 rounded-full">Save 17%</span>
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Compare multiple vehicles with ease
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-bold">$49.99</span>
                  <p className="text-xs text-muted-foreground">$16.66 per report</p>
                </div>
              </div>
              <Button
                className="mt-3 w-full"
                disabled={isLoading}
                onClick={(e) => {
                  e.stopPropagation();
                  handleCheckout('bundle_3');
                }}
              >
                {isLoading && selectedBundle === 'bundle_3' ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</>
                ) : (
                  'Buy 3-Pack'
                )}
              </Button>
            </div>
            
            <div className={`border p-4 rounded-lg ${selectedBundle === 'bundle_5' ? 'border-primary bg-primary/5' : ''} hover:border-primary/50 cursor-pointer transition-colors`}
                 onClick={() => !isLoading && setSelectedBundle('bundle_5')}>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium flex items-center">
                    <PackageCheck className="h-4 w-4 mr-2 text-primary" />
                    5-Pack Bundle <span className="ml-2 text-xs px-2 py-0.5 bg-green-100 text-green-800 rounded-full">Best Value</span>
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Get the most comprehensive coverage
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-bold">$79.99</span>
                  <p className="text-xs text-muted-foreground">$16.00 per report</p>
                </div>
              </div>
              <Button
                className="mt-3 w-full"
                disabled={isLoading}
                onClick={(e) => {
                  e.stopPropagation();
                  handleCheckout('bundle_5');
                }}
              >
                {isLoading && selectedBundle === 'bundle_5' ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</>
                ) : (
                  'Buy 5-Pack'
                )}
              </Button>
            </div>
          </div>
        </div>
        
        <DialogFooter className="flex justify-between items-center pt-2">
          <p className="text-xs text-muted-foreground">
            Secured payment processing by Stripe
          </p>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
