
import React, { useEffect, useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Car, AlertTriangle } from 'lucide-react';
import { useValuationHistory } from '@/hooks/useValuationHistory';
import { Valuation } from '@/types/valuation-history';
import { formatCurrency, formatNumber } from '@/utils/formatters';

const MyValuationsContent = () => {
  const { valuations, isLoading, error, isEmpty } = useValuationHistory();

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto py-8 px-4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">My Valuations</h1>
          </div>
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
            <span className="text-lg">Loading your valuation history...</span>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto py-8 px-4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">My Valuations</h1>
            <Button asChild>
              <Link to="/lookup">New Valuation</Link>
            </Button>
          </div>
          <Card className="p-6 border-red-200 bg-red-50">
            <CardContent className="flex items-start gap-4 p-0">
              <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-red-700 mb-2">Error Loading Valuations</h3>
                <p className="text-red-600 mb-4">{error || "We encountered an issue loading your valuation history."}</p>
                <Button 
                  onClick={() => window.location.reload()}
                  variant="destructive"
                  size="sm"
                >
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My Valuations</h1>
          <Button asChild>
            <Link to="/lookup">New Valuation</Link>
          </Button>
        </div>

        {isEmpty() ? (
          <Card className="text-center p-8">
            <CardContent className="pt-6">
              <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <Car className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-xl font-semibold mb-2">No Valuations Yet</h2>
              <p className="text-muted-foreground mb-6">
                You haven't created any vehicle valuations yet. Start by getting a valuation for your vehicle.
              </p>
              <Button asChild>
                <Link to="/lookup">Create Your First Valuation</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {valuations.map((valuation: Valuation) => (
              <ValuationCard key={valuation.id} valuation={valuation} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

// Valuation card component for displaying individual valuations
const ValuationCard = ({ valuation }: { valuation: Valuation }) => {
  // Extract core data, applying fallbacks for potentially missing fields
  const year = valuation.year || new Date().getFullYear();
  const make = valuation.make || 'Unknown Make';
  const model = valuation.model || 'Unknown Model';
  const mileage = valuation.mileage || 0;
  const condition = valuation.condition || 'Unknown';
  const estimatedValue = valuation.estimated_value || valuation.valuation || 0;
  const confidenceScore = valuation.confidence_score || 75;
  const isPremium = valuation.is_premium || valuation.premium_unlocked || false;
  const createdAt = valuation.created_at ? new Date(valuation.created_at) : new Date();

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="bg-primary/5 p-4 pb-3">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold">{year} {make} {model}</h3>
          <div className="text-sm text-muted-foreground">
            {createdAt.toLocaleDateString()}
          </div>
        </div>
      </div>
      <CardContent className="pt-4">
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <p className="text-sm text-muted-foreground">Estimated Value</p>
            <p className="font-semibold text-lg">{formatCurrency(estimatedValue)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Mileage</p>
            <p className="font-medium">{formatNumber(mileage)} mi</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Condition</p>
            <p className="font-medium">{condition}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Confidence</p>
            <div className="flex items-center">
              <div className="h-2 w-16 bg-gray-200 rounded-full mr-2">
                <div 
                  className="h-2 bg-primary rounded-full" 
                  style={{width: `${confidenceScore}%`}}
                ></div>
              </div>
              <span className="text-sm">{confidenceScore}%</span>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between mt-4">
          <Button 
            variant="outline" 
            size="sm" 
            asChild
          >
            <Link to={`/valuation/${valuation.id}`}>View Details</Link>
          </Button>
          
          {isPremium ? (
            <Button size="sm" variant="secondary" asChild>
              <Link to={`/valuation/${valuation.id}/pdf`}>Download PDF</Link>
            </Button>
          ) : (
            <Button size="sm" asChild>
              <Link to={`/valuation/${valuation.id}/upgrade`}>Upgrade to Premium</Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MyValuationsContent;
