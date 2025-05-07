
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CDButton } from '@/components/ui-kit/CDButton';
import { CheckCircle } from 'lucide-react';

interface ConfirmationPageProps {
  title: string;
  message: string;
  buttonText: string;
  buttonHref: string;
  icon?: React.ReactNode;
}

export const ConfirmationPage: React.FC<ConfirmationPageProps> = ({
  title,
  message,
  buttonText,
  buttonHref,
  icon = <CheckCircle className="h-12 w-12 text-green-500" />
}) => {
  const navigate = useNavigate();
  const handleContinue = () => {
    navigate(buttonHref);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-slate-50">
      <Card className="w-full max-w-md shadow-sm">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            {icon}
          </div>
          <CardTitle className="text-xl">{title}</CardTitle>
          <CardDescription>{message}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center mt-2">
            <CDButton 
              variant="outline" 
              block={true} 
              onClick={handleContinue}
            >
              {buttonText}
            </CDButton>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
