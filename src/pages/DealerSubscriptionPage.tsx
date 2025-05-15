
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heading, Paragraph } from '@/components/ui-kit/typography';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Download, CreditCard, AlertCircle } from 'lucide-react';

const DealerSubscriptionPage = () => {
  const [selectedPlan, setSelectedPlan] = useState('pro');
  
  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      period: '/month',
      uploads: 5,
      features: [
        'Basic valuation access',
        '5 vehicle uploads per month',
        'Limited inventory analysis',
        'Email support',
      ],
      cta: 'Current Plan',
      disabled: true
    },
    {
      id: 'starter',
      name: 'Starter',
      price: 49,
      period: '/month',
      uploads: 25,
      features: [
        'Everything in Free, plus:',
        '25 vehicle uploads per month',
        'Basic market analytics',
        'Email & chat support',
        'Valuation reports PDF export'
      ],
      cta: 'Select Plan',
    },
    {
      id: 'pro',
      name: 'Pro Dealer',
      price: 99,
      period: '/month',
      uploads: 100,
      current: true,
      features: [
        'Everything in Starter, plus:',
        '100 vehicle uploads per month',
        'Advanced inventory insights',
        'Priority customer support',
        'White-labeled valuation reports',
        'API access for integration'
      ],
      cta: 'Current Plan',
      disabled: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 249,
      period: '/month',
      uploads: 'Unlimited',
      features: [
        'Everything in Pro, plus:',
        'Unlimited vehicle uploads',
        'Custom reports and dashboards',
        'Dedicated account manager',
        'Advanced API integrations',
        'Multi-location support'
      ],
      cta: 'Select Plan',
    }
  ];

  const invoices = [
    { id: 'INV-2023-005', date: 'May 1, 2023', status: 'Paid', amount: 99 },
    { id: 'INV-2023-004', date: 'Apr 1, 2023', status: 'Paid', amount: 99 },
    { id: 'INV-2023-003', date: 'Mar 1, 2023', status: 'Paid', amount: 99 },
    { id: 'INV-2023-002', date: 'Feb 1, 2023', status: 'Paid', amount: 99 },
    { id: 'INV-2023-001', date: 'Jan 1, 2023', status: 'Paid', amount: 99 },
  ];

  const statusColor = (status: string) => {
    switch (status) {
      case 'Paid':
        return 'bg-green-100 text-green-800';
      case 'Failed':
        return 'bg-red-100 text-red-800';
      case 'Upcoming':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <Heading level={1} className="text-3xl font-bold">Subscription Settings</Heading>
        <Paragraph className="text-muted-foreground mt-2">
          Manage your subscription plan, payment methods, and billing history
        </Paragraph>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Current Plan Card */}
          <Card>
            <CardHeader>
              <CardTitle>Current Plan</CardTitle>
              <CardDescription>
                Your plan details and upcoming renewal information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold">Pro Dealer</h3>
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Active</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">Includes 100 vehicle uploads per month</p>
                </div>
                <div className="mt-4 md:mt-0 text-right">
                  <p className="text-2xl font-bold">$99<span className="text-sm font-normal text-muted-foreground">/month</span></p>
                  <p className="text-sm text-muted-foreground">Renews on June 1, 2023</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button variant="default" className="sm:flex-1">Upgrade Plan</Button>
                <Button variant="outline" className="sm:flex-1 text-muted-foreground">Cancel Subscription</Button>
              </div>
            </CardContent>
          </Card>

          {/* Billing History */}
          <Card>
            <CardHeader>
              <CardTitle>Billing History</CardTitle>
              <CardDescription>
                View and download your previous invoices
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">{invoice.id}</TableCell>
                      <TableCell>{invoice.date}</TableCell>
                      <TableCell>
                        <Badge className={statusColor(invoice.status)}>
                          {invoice.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">${invoice.amount}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon">
                          <Download className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>Payment Method</CardTitle>
              <CreditCard className="w-5 h-5 text-muted-foreground" />
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-14 bg-slate-100 rounded flex items-center justify-center">
                    <span className="font-bold text-sm">VISA</span>
                  </div>
                  <div>
                    <p className="font-medium">Visa ending in 4242</p>
                    <p className="text-sm text-muted-foreground">Expires 04/2025</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Update</Button>
              </div>
              <div className="mt-4 text-sm text-blue-600 hover:underline cursor-pointer">
                + Add another payment method
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Plan Options Carousel */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold mb-4">Available Plans</h3>
          <div className="space-y-4 lg:sticky lg:top-4">
            {plans.map((plan) => (
              <motion.div
                key={plan.id}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
                className="relative"
              >
                <Card className={`relative overflow-hidden ${plan.current ? 'border-primary border-2' : ''}`}>
                  {plan.current && (
                    <div className="absolute top-0 right-0">
                      <div className="bg-primary text-white py-1 px-3 text-xs font-semibold">
                        CURRENT
                      </div>
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle>{plan.name}</CardTitle>
                    <div className="mt-2">
                      <span className="text-3xl font-bold">${plan.price}</span>
                      <span className="text-muted-foreground">{plan.period}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-4">
                      {typeof plan.uploads === 'number' ? `${plan.uploads} vehicle uploads per month` : plan.uploads}
                    </p>
                    <ul className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm">
                          <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full" 
                      variant={plan.current ? "outline" : "default"}
                      disabled={plan.disabled}
                    >
                      {plan.cta}
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4">
              <div className="flex gap-2">
                <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-amber-800">Need a custom plan?</p>
                  <p className="text-xs text-amber-700 mt-1">
                    Contact our sales team for a plan tailored to your specific needs.
                  </p>
                  <Button variant="link" className="text-amber-800 p-0 h-auto mt-2 text-xs">
                    Contact Sales →
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DealerSubscriptionPage;
