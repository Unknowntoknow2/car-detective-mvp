
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const PaymentSuccessPage = () => {
  return (
    <div className="container mx-auto py-12 text-center">
      <h1 className="text-3xl font-bold mb-6">Payment Successful!</h1>
      <p className="mb-6">
        Thank you for your purchase. Your premium features are now unlocked.
      </p>
      <Link to="/dashboard">
        <Button>Go to Dashboard</Button>
      </Link>
    </div>
  );
};

export default PaymentSuccessPage;
