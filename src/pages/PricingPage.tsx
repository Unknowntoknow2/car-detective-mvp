
import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, CreditCard, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { checkoutSingleReport, checkoutBundle3Reports, checkoutBundle5Reports } from '@/utils/stripeService';
import { toast } from 'sonner';
import { usePremiumCredits } from '@/hooks/usePremiumCredits';

export default function PricingPage() {
  const { user } = useAuth();
  const { credits, isLoading: isLoadingCredits } = usePremiumCredits();
  const [isProcessing, setIsProcessing] = React.useState<string | null>(null);

  const handlePurchase = async (purchaseType: 'single' | 'bundle3' | 'bundle5') => {
    if (!user) {
      toast.error('Please sign in to continue with your purchase');
      return;
    }

    setIsProcessing(purchaseType);
    try {
      let checkoutUrl: string;
      
      switch (purchaseType) {
        case 'single':
          checkoutUrl = await checkoutSingleReport(user.id);
          break;
        case 'bundle3':
          checkoutUrl = await checkoutBundle3Reports(user.id);
          break;
        case 'bundle5':
          checkoutUrl = await checkoutBundle5Reports(user.id);
          break;
      }
      
      // Redirect to Stripe checkout
      window.location.href = checkoutUrl;
    } catch (error) {
      console.error('Payment initiation error:', error);
      toast.error('Failed to start the payment process. Please try again.');
    } finally {
      setIsProcessing(null);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 container py-12">
        <div className="mx-auto max-w-5xl space-y-10">
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Premium Report Credits</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Unlock detailed market insights, CARFAX® report integration, and precise valuations
            </p>
            
            {!isLoadingCredits && credits > 0 && (
              <Badge className="bg-primary text-white px-3 py-1.5 text-base">
                You have {credits} Premium Credit{credits !== 1 ? 's' : ''}
              </Badge>
            )}
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Single Report */}
            <Card className="border-2 border-muted">
              <CardHeader>
                <CardTitle className="text-2xl">Single Report</CardTitle>
                <CardDescription>One-time premium valuation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-3xl font-bold">$14.99</div>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-600 mr-2 shrink-0" />
                    <span>Full CARFAX® data integration</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-600 mr-2 shrink-0" />
                    <span>Detailed condition assessment</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-600 mr-2 shrink-0" />
                    <span>Downloadable PDF report</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={() => handlePurchase('single')} 
                  className="w-full" 
                  disabled={isProcessing !== null}
                >
                  {isProcessing === 'single' ? 'Processing...' : 'Buy Single Report'}
                </Button>
              </CardFooter>
            </Card>

            {/* Bundle of 3 */}
            <Card className="border-2 border-primary relative">
              <div className="absolute top-0 right-0 -translate-y-1/2 bg-primary text-white px-3 py-1 rounded-full text-xs font-medium">
                Most Popular
              </div>
              <CardHeader>
                <CardTitle className="text-2xl">Bundle of 3</CardTitle>
                <CardDescription>Save 15% on multiple reports</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-3xl font-bold">$38.99</div>
                <div className="text-sm text-muted-foreground">
                  $12.99 per report (Save $6)
                </div>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-600 mr-2 shrink-0" />
                    <span>All features of single report</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-600 mr-2 shrink-0" />
                    <span>Use credits anytime within 12 months</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-600 mr-2 shrink-0" />
                    <span>Compare multiple vehicles</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={() => handlePurchase('bundle3')} 
                  className="w-full" 
                  disabled={isProcessing !== null}
                >
                  {isProcessing === 'bundle3' ? 'Processing...' : 'Buy 3 Credits'}
                </Button>
              </CardFooter>
            </Card>

            {/* Bundle of 5 */}
            <Card className="border-2 border-muted">
              <CardHeader>
                <CardTitle className="text-2xl">Bundle of 5</CardTitle>
                <CardDescription>Best value for frequent users</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-3xl font-bold">$59.99</div>
                <div className="text-sm text-muted-foreground">
                  $11.99 per report (Save $15)
                </div>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-600 mr-2 shrink-0" />
                    <span>All features of bundle of 3</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-600 mr-2 shrink-0" />
                    <span>Priority support</span>
                  </li>
                  <li className="flex items-start">
                    <Shield className="h-5 w-5 text-green-600 mr-2 shrink-0" />
                    <span>20% more accurate valuations</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={() => handlePurchase('bundle5')} 
                  className="w-full" 
                  disabled={isProcessing !== null}
                >
                  {isProcessing === 'bundle5' ? 'Processing...' : 'Buy 5 Credits'}
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div className="bg-muted/50 rounded-lg p-6 max-w-3xl mx-auto">
            <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">How long do my credits last?</h3>
                <p className="text-muted-foreground">Credits are valid for 12 months from the date of purchase.</p>
              </div>
              <div>
                <h3 className="font-medium">What if I run out of credits?</h3>
                <p className="text-muted-foreground">You can purchase more credits at any time. Your account will show your remaining credits.</p>
              </div>
              <div>
                <h3 className="font-medium">Can I get a refund?</h3>
                <p className="text-muted-foreground">If you haven't used any credits from a bundle, we offer refunds within 7 days of purchase.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
