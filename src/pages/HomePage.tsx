
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, ArrowRightCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="bg-white min-h-screen text-gray-900">
      {/* Hero Section */}
      <section className="w-full px-6 py-24 bg-gradient-to-br from-slate-50 to-white text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
          Know Your Car's True Value Instantly
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          Powered by AI, trusted by dealers, loved by individuals.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button size="lg" onClick={() => navigate('/lookup/vin')}>
            VIN Lookup
          </Button>
          <Button size="lg" variant="outline" onClick={() => navigate('/lookup/manual')}>
            Manual Entry
          </Button>
          <Button size="lg" variant="ghost" onClick={() => navigate('/lookup/plate')}>
            Plate Search
          </Button>
        </div>
        <div className="mt-4 text-sm text-muted-foreground flex items-center justify-center gap-2">
          <Sparkles className="h-4 w-4" /> Real-time market data + AI scoring engine
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 bg-white text-center">
        <h2 className="text-3xl font-semibold mb-6">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {['Valuation', 'Offers', 'PDF Report'].map((step, idx) => (
            <Card key={idx} className="transition hover:shadow-lg">
              <CardContent className="py-8">
                <p className="text-4xl font-bold">{idx + 1}</p>
                <p className="mt-2 text-lg font-medium">{step}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Dealer CTA */}
      <section className="py-16 px-6 bg-slate-100 text-center">
        <h3 className="text-2xl font-bold mb-2">For Dealers</h3>
        <p className="text-muted-foreground mb-6">
          Access bulk valuations, lead management, and market trend insights
        </p>
        <Button size="lg" onClick={() => navigate('/auth/SignUpDealer')}>
          Join as a Dealer <ArrowRightCircle className="ml-2 h-5 w-5" />
        </Button>
      </section>

      {/* Trust Logos */}
      <section className="py-10 px-6 bg-white flex justify-center items-center gap-12">
        <img src="/logos/carfax.png" alt="CARFAX" className="h-8 grayscale" />
        <img src="/logos/stripe.png" alt="Stripe" className="h-8 grayscale" />
        <img src="/logos/military.png" alt="Military-grade" className="h-8 grayscale" />
      </section>
    </div>
  );
}
