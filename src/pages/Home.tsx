
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Search, DollarSign, Car } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="container mx-auto py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-4">Vehicle Valuation Platform</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Get accurate valuations, decode VINs, track service history, and manage your vehicle's records in one place.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-primary" />
              VIN Lookup
            </CardTitle>
            <CardDescription>
              Decode your vehicle's VIN to get detailed information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              Enter your 17-character Vehicle Identification Number to get complete details about your vehicle's make, model, year, and specifications.
            </p>
          </CardContent>
          <CardFooter>
            <Link to="/vin-lookup" className="w-full">
              <Button className="w-full">Decode VIN</Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              Premium Valuation
            </CardTitle>
            <CardDescription>
              Get an accurate valuation with detailed market analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              Our premium valuation considers condition, mileage, features, market trends, and more for the most accurate estimate of your vehicle's worth.
            </p>
          </CardContent>
          <CardFooter>
            <Link to="/premium-valuation" className="w-full">
              <Button className="w-full">Get Valuation</Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Vehicle History
            </CardTitle>
            <CardDescription>
              Track service history, title status, and ownership
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              Document your vehicle's service history, manage title information, and track ownership details to maintain accurate records and improve resale value.
            </p>
          </CardContent>
          <CardFooter>
            <Link to="/vehicle-history" className="w-full">
              <Button className="w-full">Manage History</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>

      <div className="bg-muted p-6 rounded-lg">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold mb-2">Ready to get started?</h2>
            <p className="text-muted-foreground">
              Choose a service above or explore our premium features for in-depth analysis and reporting.
            </p>
          </div>
          <Link to="/premium-valuation">
            <Button size="lg" className="whitespace-nowrap">
              <Car className="mr-2 h-4 w-4" />
              Explore Premium Features
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
