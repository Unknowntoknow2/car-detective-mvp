import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

export type PaymentMethod = {
  id: string;
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
  isDefault: boolean;
};

interface PaymentMethodCardProps {
  paymentMethods: PaymentMethod[];
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const PaymentMethodCard: React.FC<PaymentMethodCardProps> = ({
  paymentMethods,
  isLoading,
  setIsLoading
}) => {
  const [methods, setMethods] = useState<PaymentMethod[]>(paymentMethods);
  const [showAddCardDialog, setShowAddCardDialog] = useState(false);
  const { toast } = useToast();
  
  const getBrandLogo = (brand: string) => {
    switch (brand.toLowerCase()) {
      case 'visa':
        return '/assets/visa.svg';
      case 'mastercard':
        return '/assets/mastercard.svg';
      case 'amex':
        return '/assets/amex.svg';
      default:
        return '/assets/generic-card.svg';
    }
  };
  
  const handleDeleteCard = (id: string) => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      // Remove card from state
      setMethods(methods.filter(m => m.id !== id));
      setIsLoading(false);
      toast({
        description: "Your payment method has been successfully removed."
      });
    }, 1000);
  };
  
  const handleSetDefaultCard = (id: string) => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      // Update default card
      setMethods(methods.map(m => ({
        ...m,
        isDefault: m.id === id
      })));
      setIsLoading(false);
      toast({
        description: "Your default payment method has been changed."
      });
    }, 1000);
  };
  
  const handleAddCard = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      const newCard = {
        id: `card_${Date.now()}`,
        brand: 'Mastercard',
        last4: '5678',
        expMonth: 12,
        expYear: 28,
        isDefault: methods.length === 0
      };
      setMethods([...methods, newCard]);
      setIsLoading(false);
      setShowAddCardDialog(false);
      toast({
        description: "Your new payment method has been added successfully."
      });
    }, 1500);
  };
  
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Payment Methods
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {methods.length === 0 ? (
            <div className="text-center p-6 bg-muted/20 rounded-lg">
              <CreditCard className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
              <p className="text-muted-foreground">No payment methods found</p>
              <p className="text-sm text-muted-foreground mt-1">Add a card to manage your subscription</p>
            </div>
          ) : (
            methods.map((method, index) => (
              <motion.div
                key={method.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
                className={`
                  p-4 rounded-lg border flex items-center justify-between
                  ${method.isDefault ? 'bg-accent/30 border-accent' : 'bg-muted/20'}
                `}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-6 flex items-center">
                    {/* Brand logo would go here, using text as fallback */}
                    <span className="text-sm font-semibold">{method.brand}</span>
                  </div>
                  <div>
                    <p className="font-medium">•••• {method.last4}</p>
                    <p className="text-xs text-muted-foreground">
                      Expires {method.expMonth.toString().padStart(2, '0')}/{method.expYear}
                      {method.isDefault && (
                        <span className="ml-2 text-primary font-medium">Default</span>
                      )}
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  {!method.isDefault && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSetDefaultCard(method.id)}
                      disabled={isLoading}
                    >
                      Make Default
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteCard(method.id)}
                    disabled={isLoading || (method.isDefault && methods.length > 1)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Dialog open={showAddCardDialog} onOpenChange={setShowAddCardDialog}>
          <DialogTrigger asChild>
            <Button className="w-full" variant="outline">
              <Plus className="mr-2 h-4 w-4" /> Add Payment Method
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Payment Method</DialogTitle>
              <DialogDescription>
                Add a new credit card to pay for your subscription
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-4">
              {/* This would be a credit card form in a real implementation */}
              <div className="border rounded-md p-4 mb-4">
                <p className="text-center text-muted-foreground">
                  [Credit Card Entry Form Would Go Here]
                </p>
                <p className="text-center text-xs text-muted-foreground mt-2">
                  Card details are securely processed through Stripe.
                </p>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddCardDialog(false)} disabled={isLoading}>
                Cancel
              </Button>
              <Button onClick={handleAddCard} disabled={isLoading}>
                {isLoading ? "Processing..." : "Add Card"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
};
