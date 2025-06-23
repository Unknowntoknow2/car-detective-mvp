
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

interface RouteRedirectProps {
  to: string;
}

export const RouteRedirect: React.FC<RouteRedirectProps> = ({ to }) => {
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Replace parameters in the target route
    let targetRoute = to;
    Object.entries(params).forEach(([key, value]) => {
      targetRoute = targetRoute.replace(`:${key}`, value || '');
    });
    
    navigate(targetRoute, { replace: true });
  }, [navigate, to, params]);

  return <div>Redirecting...</div>;
};
