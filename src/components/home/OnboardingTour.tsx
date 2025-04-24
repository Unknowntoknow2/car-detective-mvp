
import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Car, FileText, ShieldCheck, MessagesSquare } from "lucide-react";

export function OnboardingTour() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('onboardingDone')) {
      setIsOpen(true);
    }
  }, []);

  const closeOnboarding = () => {
    localStorage.setItem('onboardingDone', 'true');
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Welcome to CarDetective!</DialogTitle>
        </DialogHeader>
        
        <div className="py-6">
          <div className="grid gap-6">
            {[
              {
                icon: Car,
                title: "Multiple Lookup Methods",
                description: "Enter VIN, plate, or manual details to get started"
              },
              {
                icon: FileText,
                title: "Comprehensive Reports",
                description: "Download detailed PDF reports with full analysis"
              },
              {
                icon: ShieldCheck,
                title: "Accurate Valuations",
                description: "AI-driven condition scoring and market analysis"
              },
              {
                icon: MessagesSquare,
                title: "Dealer Network",
                description: "Receive real-time offers from verified dealers"
              }
            ].map((feature, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={closeOnboarding}>Got it, thanks!</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
