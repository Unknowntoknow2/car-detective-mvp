
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const PaymentCancelledPage = () => {
  return (
    <div className="container mx-auto py-12 text-center">
      <h1 className="text-3xl font-bold mb-6">Payment Cancelled</h1>
      <p className="mb-6">
        Your payment process was cancelled. No charges were made.
      </p>
      <Link to="/premium">
        <Button>Try Again</Button>
      </Link>
    </div>
  );
};

export default PaymentCancelledPage;
