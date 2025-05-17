import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import FollowUpForm from '@/components/followup/FollowUpForm';

const ValuationFollowUpPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const vin = searchParams.get('vin');

  const handleSubmit = (followUpData: any) => {
    const vinData = localStorage.getItem(`vin_lookup_${vin}`);
    if (!vinData) return;

    const parsed = JSON.parse(vinData);
    const combined = {
      ...parsed,
      ...followUpData,
    };

    localStorage.setItem(`vin_lookup_${vin}`, JSON.stringify(combined));
    navigate(`/valuation-result?vin=${vin}`);
  };

  return <FollowUpForm onSubmit={handleSubmit} />;
};

export default ValuationFollowUpPage;
