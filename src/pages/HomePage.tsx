
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Container } from '@/components/ui/container';
import { Link } from 'react-router-dom';
import { Car, CheckCircle, FileText } from 'lucide-react';

export default function HomePage() {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-slate-50 to-white py-20 border-b">
        <Container>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                Get the Most Accurate Vehicle Valuation
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                Know exactly what your car is worth with our advanced valuation tool. Quick, easy, and accurate.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" asChild>
                  <Link to="/vin-lookup">
                    <Car className="mr-2 h-5 w-5" />
                    VIN Lookup
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/premium">
                    <FileText className="mr-2 h-5 w-5" />
                    Premium Valuation
                  </Link>
                </Button>
              </div>
            </div>
            <div className="hidden md:block">
              <img 
                src="https://images.unsplash.com/photo-1551501427-63a3bd1a3cd7?auto=format&fit=crop&q=80&w=600&h=400" 
                alt="Car valuation" 
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </Container>
      </section>
      
      {/* Features Section */}
      <section className="py-16">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Get your vehicle's value in three simple steps.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="pt-6">
                <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <span className="text-xl font-bold text-primary">1</span>
                </div>
                <h3 className="text-xl font-bold text-center mb-2">Enter Vehicle Info</h3>
                <p className="text-center text-muted-foreground">
                  Input your VIN or enter your vehicle details manually for the most accurate results.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <span className="text-xl font-bold text-primary">2</span>
                </div>
                <h3 className="text-xl font-bold text-center mb-2">Provide Details</h3>
                <p className="text-center text-muted-foreground">
                  Tell us about your vehicle's condition, mileage, and other factors that affect its value.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <span className="text-xl font-bold text-primary">3</span>
                </div>
                <h3 className="text-xl font-bold text-center mb-2">Get Your Valuation</h3>
                <p className="text-center text-muted-foreground">
                  Receive a detailed report with your vehicle's current market value and insights.
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="text-center mt-12">
            <Button size="lg" asChild>
              <Link to="/vin-lookup">Get Started Now</Link>
            </Button>
          </div>
        </Container>
      </section>
      
      {/* Premium Section */}
      <section className="py-16 bg-slate-50">
        <Container>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">Premium Valuation</h2>
              <p className="text-muted-foreground mb-6">
                Get the most comprehensive vehicle valuation with our premium package, including CARFAX® reports, detailed market analysis, and more.
              </p>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  <span>CARFAX® Vehicle History Report</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  <span>Detailed Market Analysis</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  <span>Comprehensive PDF Report</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  <span>12-Month Price Forecast</span>
                </li>
              </ul>
              
              <Button asChild>
                <Link to="/premium">Learn More About Premium</Link>
              </Button>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-4">
                  <FileText className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-1">Premium Report</h3>
                <p className="text-muted-foreground">Comprehensive vehicle analysis</p>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between pb-2 border-b">
                  <span>Basic Valuation</span>
                  <span>✓</span>
                </div>
                <div className="flex justify-between pb-2 border-b">
                  <span>Market Comparison</span>
                  <span>✓</span>
                </div>
                <div className="flex justify-between pb-2 border-b">
                  <span>CARFAX® Report</span>
                  <span>✓</span>
                </div>
                <div className="flex justify-between pb-2 border-b">
                  <span>Price Forecast</span>
                  <span>✓</span>
                </div>
                <div className="flex justify-between pb-2 border-b">
                  <span>Dealer Insights</span>
                  <span>✓</span>
                </div>
                <div className="flex justify-between pb-2 border-b font-bold">
                  <span>One-time Payment</span>
                  <span>$29.99</span>
                </div>
              </div>
              
              <Button className="w-full" asChild>
                <Link to="/premium">Get Premium</Link>
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </MainLayout>
  );
}
