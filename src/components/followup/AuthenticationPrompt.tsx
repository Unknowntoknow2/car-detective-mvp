import React from 'react';
import { AlertCircle, User, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface AuthenticationPromptProps {
  onSignIn: () => void;
  onContinueAsGuest: () => void;
  show: boolean;
}

export function AuthenticationPrompt({ onSignIn, onContinueAsGuest, show }: AuthenticationPromptProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-100 rounded-full">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
          </div>
          <h2 className="text-lg font-semibold">Save Your Progress</h2>
        </div>
        
        <Alert className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            To save your valuation progress and access it later, please sign in or create an account.
          </AlertDescription>
        </Alert>

        <div className="space-y-3">
          <Button 
            onClick={onSignIn}
            className="w-full flex items-center gap-2"
          >
            <User className="w-4 h-4" />
            Sign In / Create Account
          </Button>
          
          <Button 
            variant="outline" 
            onClick={onContinueAsGuest}
            className="w-full"
          >
            Continue as Guest
          </Button>
        </div>
        
        <p className="text-xs text-gray-500 mt-3 text-center">
          Guest mode will save temporarily to your browser only
        </p>
      </div>
    </div>
  );
}