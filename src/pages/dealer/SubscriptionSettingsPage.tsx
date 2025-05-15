import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Calendar, CreditCard, Download, Plus, ShieldCheck, Sparkles, Trash2 } from 'lucide-react';
import DealerLayout from '@/layouts/DealerLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from '@/components/ui/use-toast';
import { PlanSelectorCarousel } from '@/components/dealer/subscription/PlanSelectorCarousel';
import { PaymentMethodCard } from '@/components/dealer/subscription/PaymentMethodCard';
import { currentPlanFeatures, mockPaymentMethods, mockInvoices } from '@/components/dealer/subscription/subscriptionData';

const SubscriptionSettingsPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  
  // Mock subscription data (would come from API in real implementation)
  const currentPlan = {
    name: "Pro Dealer",
    status: "active",
    price: 29.99,
    vehicleUploads: 100,
    renewalDate: "November 15, 2025",
    nextBillingAmount: 29.99
  };
  
  const handleUpgrade = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        description: "Choose your new plan below"
      });
      
      // Smooth scroll to plan selector
      document.getElementById('plan-selector')?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }, 1000);
  };
  
  const handleCancelSubscription = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setShowCancelDialog(false);
      toast({
        description: "Your subscription will remain active until the end of the billing period"
      });
    }, 1500);
  };
  
  const handleDownloadInvoice = (invoiceId: string) => {
    setIsLoading(true);
    // Simulate download
    setTimeout(() => {
      setIsLoading(false);
      toast({
        description: `Invoice #${invoiceId} has been downloaded`
      });
    }, 800);
  };
  
  return (
    <DealerLayout>
      <div className="container py-8 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Subscription Settings</h1>
              <p className="text-muted-foreground mt-2">Manage your dealer subscription and billing information</p>
            </div>
            
            <Button 
              variant="outline" 
              onClick={() => window.history.back()}
              className="mt-4 md:mt-0"
            >
              Back to Dashboard
            </Button>
          </div>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Current Plan Card */}
          <motion.div 
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="border-2 border-primary/10 shadow-md">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl flex items-center gap-2">
                      Current Plan
                      <Sparkles className="h-5 w-5 text-amber-500" />
                    </CardTitle>
                    <CardDescription>Your active subscription details</CardDescription>
                  </div>
                  <Badge 
                    variant={currentPlan.status === "active" ? "default" : "secondary"}
                    className="ml-auto"
                  >
                    {currentPlan.status === "active" ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="flex flex-col md:flex-row justify-between">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-3xl font-bold text-primary">{currentPlan.name}</h3>
                      <p className="text-xl mt-1">${currentPlan.price.toFixed(2)}<span className="text-sm text-muted-foreground">/month</span></p>
                    </div>
                    
                    <ul className="space-y-2 text-sm">
                      {currentPlanFeatures.map((feature, index) => (
                        <motion.li 
                          key={index}
                          className="flex items-start"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: 0.2 + (index * 0.1) }}
                        >
                          <ShieldCheck className="h-5 w-5 text-green-500 shrink-0 mr-2" />
                          <span>{feature}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="mt-6 md:mt-0 space-y-4 flex flex-col items-start">
                    <div className="bg-muted/50 p-4 rounded-lg w-full">
                      <div className="flex items-center mb-2">
                        <Calendar className="h-4 w-4 text-muted-foreground mr-2" />
                        <span className="text-sm text-muted-foreground">Next Renewal</span>
                      </div>
                      <p className="font-medium">{currentPlan.renewalDate}</p>
                      <p className="text-sm mt-1">You will be charged ${currentPlan.nextBillingAmount.toFixed(2)}</p>
                    </div>
                    
                    <div className="w-full">
                      <Button 
                        variant="default" 
                        size="lg" 
                        className="w-full mb-2 bg-gradient-to-r from-indigo-600 to-purple-600"
                        onClick={handleUpgrade}
                        disabled={isLoading}
                      >
                        {isLoading ? "Processing..." : "Upgrade Plan"}
                      </Button>
                      
                      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full text-muted-foreground"
                          >
                            Cancel Subscription
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Cancel Your Subscription</DialogTitle>
                            <DialogDescription>
                              Are you sure you want to cancel your subscription? You'll lose access to premium features after the current billing period.
                            </DialogDescription>
                          </DialogHeader>
                          
                          <div className="py-4">
                            <Alert variant="destructive" className="mb-4">
                              <AlertTriangle className="h-4 w-4" />
                              <AlertTitle>Warning</AlertTitle>
                              <AlertDescription>
                                Your subscription will remain active until {currentPlan.renewalDate}, after which your account will be downgraded to the free tier.
                              </AlertDescription>
                            </Alert>
                          </div>
                          
                          <DialogFooter>
                            <Button 
                              variant="outline" 
                              onClick={() => setShowCancelDialog(false)}
                              disabled={isLoading}
                            >
                              Keep My Subscription
                            </Button>
                            <Button 
                              variant="destructive" 
                              onClick={handleCancelSubscription}
                              disabled={isLoading}
                            >
                              {isLoading ? "Processing..." : "Confirm Cancellation"}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Payment Method Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <PaymentMethodCard 
              paymentMethods={mockPaymentMethods}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
            />
          </motion.div>
          
          {/* Billing History */}
          <motion.div 
            className="lg:col-span-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Billing History</CardTitle>
                <CardDescription>Your recent subscription charges and payments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">Invoice</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockInvoices.map((invoice) => (
                        <TableRow key={invoice.id}>
                          <TableCell className="font-medium">#{invoice.id}</TableCell>
                          <TableCell>{invoice.date}</TableCell>
                          <TableCell>${invoice.amount.toFixed(2)}</TableCell>
                          <TableCell>
                            <Badge 
                              variant={
                                invoice.status === "paid" ? "success" :
                                invoice.status === "pending" ? "outline" : "destructive"
                              }
                              className={invoice.status === "success" ? "bg-green-500" : ""}
                            >
                              {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleDownloadInvoice(invoice.id)}
                                    disabled={invoice.status !== "paid" || isLoading}
                                  >
                                    <Download className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Download Invoice</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between text-sm text-muted-foreground">
                <div>Showing last 5 invoices</div>
                <Button variant="link" size="sm" className="h-auto p-0">
                  View all invoices
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
          
          {/* Plan Selector */}
          <motion.div 
            id="plan-selector"
            className="lg:col-span-3 mt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <PlanSelectorCarousel 
              currentPlanId="pro"
              isLoading={isLoading}
              setIsLoading={setIsLoading}
            />
          </motion.div>
        </div>
      </div>
    </DealerLayout>
  );
};

export default SubscriptionSettingsPage;
