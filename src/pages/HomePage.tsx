
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Car, Shield, DollarSign, Star, LogIn } from 'lucide-react';
import HeroImage from '@/assets/hero-car.jpg';
import { useAuth } from '@/contexts/AuthContext';

const HomePage: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-900 to-primary-800 text-white py-20 lg:py-32">
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Discover Your Car's <span className="text-yellow-400">True Value</span>
              </h1>
              <p className="text-lg md:text-xl mb-8 text-gray-100 max-w-xl">
                Get accurate, market-based valuations for your vehicle in seconds. Make informed decisions when buying, selling, or trading in.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black">
                  <Link to="/valuation">Get Free Valuation</Link>
                </Button>
                {user ? (
                  <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                    <Link to="/dashboard">Go to Dashboard</Link>
                  </Button>
                ) : (
                  <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                    <Link to="/auth">
                      <LogIn className="mr-2 h-4 w-4" />
                      Sign In
                    </Link>
                  </Button>
                )}
              </div>
            </div>
            <div className="hidden lg:block">
              <img 
                src={HeroImage} 
                alt="Car valuation" 
                className="rounded-lg shadow-2xl max-w-md mx-auto transform -rotate-2"
              />
            </div>
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/40 to-indigo-900/40 mix-blend-multiply"></div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            <div className="bg-white p-8 rounded-xl shadow-md text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-primary-100 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <Car className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Enter Vehicle Details</h3>
              <p className="text-gray-600">Provide your car's make, model, year, and condition for a basic valuation</p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-md text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-primary-100 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Get Instant Results</h3>
              <p className="text-gray-600">Receive an accurate valuation based on current market data</p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-md text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-primary-100 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <Star className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Upgrade to Premium</h3>
              <p className="text-gray-600">Get detailed reports with CARFAX history and dealer offers</p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-md text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-primary-100 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <DollarSign className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Make Better Decisions</h3>
              <p className="text-gray-600">Use your valuation to negotiate confidently when buying or selling</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-primary text-white text-center">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to discover your car's value?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-gray-100">
            Get a free valuation now and join thousands of satisfied users who make smarter automotive decisions.
          </p>
          <Button asChild size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black">
            <Link to="/valuation">Get Started for Free</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
