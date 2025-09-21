
import React from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Star, Zap } from "lucide-react";

interface BuyCreditsModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  currentCredits?: number;
}

const creditPackages = [
  {
    id: "starter",
    name: "Starter Pack",
    credits: 10,
    price: 49,
    popular: false,
    description: "Perfect for individual vehicle valuations"
  },
  {
    id: "professional",
    name: "Professional Pack", 
    credits: 25,
    price: 99,
    popular: true,
    description: "Great for dealers and professionals"
  },
  {
    id: "enterprise",
    name: "Enterprise Pack",
    credits: 100,
    price: 299,
    popular: false,
    description: "Best value for high-volume users"
  }
];

export function BuyCreditsModal({ isOpen, onOpenChange, currentCredits = 0 }: BuyCreditsModalProps) {
  const handlePurchase = (packageId: string) => {
    // Implementation for purchase logic
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Buy Premium Credits
          </DialogTitle>
          <DialogDescription>
            Choose a credit package to unlock premium vehicle valuations with detailed reports and market analysis.
            You currently have {currentCredits} credits remaining.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 md:grid-cols-3 py-4">
          {creditPackages.map((pkg) => (
            <Card key={pkg.id} className={`relative ${pkg.popular ? 'border-primary' : ''}`}>
              {pkg.popular && (
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                  <Badge variant="default" className="bg-primary">
                    <Star className="w-3 h-3 mr-1" />
                    Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2">
                  <Zap className="w-5 h-5" />
                  {pkg.name}
                </CardTitle>
                <CardDescription>{pkg.description}</CardDescription>
              </CardHeader>
              
              <CardContent className="text-center space-y-4">
                <div>
                  <div className="text-3xl font-bold">${pkg.price}</div>
                  <div className="text-sm text-muted-foreground">
                    {pkg.credits} Premium Credits
                  </div>
                  <div className="text-xs text-muted-foreground">
                    ${(pkg.price / pkg.credits).toFixed(2)} per credit
                  </div>
                </div>
                
                <Button 
                  className="w-full" 
                  variant={pkg.popular ? "default" : "outline"}
                  onClick={() => handlePurchase(pkg.id)}
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Purchase
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default BuyCreditsModal;
