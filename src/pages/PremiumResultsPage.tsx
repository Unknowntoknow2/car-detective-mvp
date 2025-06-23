
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function PremiumResultsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the unified results page
    if (id) {
      navigate(`/results/${id}`, { replace: true });
    } else {
      navigate('/', { replace: true });
    }
  }, [id, navigate]);

  return (
    <div className="container mx-auto py-8 text-center">
      <p>Redirecting to premium results...</p>
    </div>
  );
}
