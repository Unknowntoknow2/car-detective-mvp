
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { DealerOfferForm } from '@/components/dealer/DealerOfferForm';
import { DealerOffersList } from '@/components/dealer/DealerOffersList';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useDealerOffers } from '@/hooks/useDealerOffers';

export default function DealerOffersPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { submitOffer } = useDealerOffers();

  React.useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">Dealer Offers Dashboard</h1>
        <div className="grid gap-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Your Active Offers</h2>
            <DealerOffersList reportId={""} />
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
