
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function ViewOfferPage() {
  const { token } = useParams<{ token: string }>();
  const [offer, setOffer] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      // Mock offer data
      setOffer({
        id: token,
        dealerName: 'Sample Dealer',
        offerAmount: 18500,
        vehicleYear: 2020,
        vehicleMake: 'Toyota',
        vehicleModel: 'Camry'
      });
      setLoading(false);
    }
  }, [token]);

  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto py-8">
          <p>Loading offer...</p>
        </div>
      </MainLayout>
    );
  }

  if (!offer) {
    return (
      <MainLayout>
        <div className="container mx-auto py-8">
          <p>Offer not found</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>Dealer Offer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">Vehicle</h3>
                <p>{offer.vehicleYear} {offer.vehicleMake} {offer.vehicleModel}</p>
              </div>
              <div>
                <h3 className="font-semibold">Dealer</h3>
                <p>{offer.dealerName}</p>
              </div>
              <div>
                <h3 className="font-semibold">Offer Amount</h3>
                <p className="text-2xl font-bold">${offer.offerAmount.toLocaleString()}</p>
              </div>
              <Button>Accept Offer</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
