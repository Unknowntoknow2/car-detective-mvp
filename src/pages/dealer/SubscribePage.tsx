
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { 
  Building, 
  Shield, 
  Check, 
  PieChart, 
  Users, 
  BarChart, 
  LineChart, 
  BellRing, 
  ArrowRight
} from 'lucide-react';

const features = [
  {
    title: 'Enhanced Dealership Profile',
    description: 'Showcase your dealership with a professional profile, including logo, contact information, and custom branding.',
    icon: Building
  },
  {
    title: 'Advanced Analytics Dashboard',
    description: 'Track key performance indicators, monitor website traffic, and gain insights into customer behavior.',
    icon: PieChart
  },
  {
    title: 'Unlimited Vehicle Listings',
    description: 'List as many vehicles as you want without any restrictions, maximizing your online presence.',
    icon: BarChart
  },
  {
    title: 'Dedicated Account Manager',
    description: 'Receive personalized support and guidance from a dedicated account manager to optimize your sales strategy.',
    icon: Users
  },
  {
    title: 'Priority Customer Support',
    description: 'Get faster response times and priority assistance from our customer support team.',
    icon: BellRing
  },
  {
    title: 'Market Trend Analysis',
    description: 'Stay ahead of the competition with real-time market trend analysis and insights.',
    icon: LineChart
  }
];

const SubscribePage = () => {
  const navigate = useNavigate();

  return (
    <div className="container py-24">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight">Unlock Premium Dealer Features</h1>
        <p className="text-lg text-muted-foreground mt-4">
          Upgrade your account to access exclusive tools and resources that will help you grow your business.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <Card key={index} className="border-primary/20 hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <feature.icon className="h-5 w-5 text-primary" />
                {feature.title}
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                {feature.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-none space-y-3">
                <li className="flex items-center">
                  <Check className="h-4 w-4 mr-2 text-green-500" />
                  <span className="text-sm">Enhanced visibility on our platform</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 mr-2 text-green-500" />
                  <span className="text-sm">Access to premium customer leads</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 mr-2 text-green-500" />
                  <span className="text-sm">Dedicated support and resources</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full justify-center">
                Upgrade Now <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-16 text-center">
        <p className="text-sm text-muted-foreground">
          Secure your dealership's future with our premium subscription.
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          All transactions are protected by industry-leading security measures.
        </p>
      </div>
    </div>
  );
};

export default SubscribePage;
