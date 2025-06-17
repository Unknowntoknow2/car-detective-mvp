
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface UnauthorizedRedirectTabProps {
  title: string;
  description: string;
  redirectTo?: string;
}

const UnauthorizedRedirectTab: React.FC<UnauthorizedRedirectTabProps> = ({
  title,
  description,
  redirectTo = '/auth'
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleRedirect = () => {
    if (!user) {
      navigate('/auth');
    } else {
      navigate(redirectTo);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
            <Lock className="h-6 w-6 text-gray-600" />
          </div>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-gray-600 mb-6">{description}</p>
          <Button onClick={handleRedirect} className="w-full">
            {!user ? 'Sign In' : 'Get Access'}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default UnauthorizedRedirectTab;
