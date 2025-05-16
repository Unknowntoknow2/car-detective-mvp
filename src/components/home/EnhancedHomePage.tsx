
import React from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import { Button } from '@/components/ui/button';
import { LockIcon } from 'lucide-react';
import { Container } from '@/components/ui/container';

export const EnhancedHomePage: React.FC = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/valuation');
  };

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-16 md:py-24">
        <Container className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Get Your Vehicle's <span className="text-primary">True Value</span>
          </h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto text-gray-600">
            Our AI-powered valuation tools give you the most accurate estimate of your vehicle's worth in today's market.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={handleGetStarted}>
              Get Started Free
            </Button>
            <Button size="lg" variant="outline">
              Learn More
            </Button>
          </div>
        </Container>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <Container>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-xl font-semibold mb-3">AI-Powered Accuracy</h3>
              <p className="text-gray-600">Our algorithms analyze thousands of data points to give you the most accurate valuation.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-xl font-semibold mb-3">Market Insights</h3>
              <p className="text-gray-600">Get detailed market trends and data to understand your vehicle's position in the market.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-xl font-semibold mb-3">Premium Reports</h3>
              <p className="text-gray-600">Upgrade to premium for comprehensive valuation reports with dealer-level insights.</p>
            </div>
          </div>
        </Container>
      </section>

      {/* Premium Section */}
      <section className="py-16 bg-gray-50">
        <Container>
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold mb-4">Unlock Premium Features</h2>
              <p className="text-gray-600 mb-6">
                Get access to comprehensive vehicle history, market trend analysis, and dealer comparison tools.
              </p>
              <Button className="flex items-center gap-2">
                <LockIcon size={16} />
                Upgrade to Premium
              </Button>
            </div>
            <div className="md:w-1/2 bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h3 className="text-xl font-semibold mb-3">Premium Benefits</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Comprehensive vehicle history reports</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>12-month market forecast predictions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Dealer offers comparison</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Printable PDF reports</span>
                </li>
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-white">
        <Container>
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to value your vehicle?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              Get started with our free valuation tool and discover your vehicle's true market value.
            </p>
            <Button size="lg" variant="secondary" onClick={handleGetStarted}>
              Get Your Free Valuation
            </Button>
          </div>
        </Container>
      </section>
    </MainLayout>
  );
};

export default EnhancedHomePage;
