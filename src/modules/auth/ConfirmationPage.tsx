
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';
import { CDButton } from '@/components/ui-kit/CDButton';
import { AuthLayout } from './AuthLayout';

const ConfirmationPage: React.FC = () => {
  return (
    <AuthLayout 
      title="Check your email"
      subtitle="Confirm your email address"
      quote="One more step to accurate valuations and trusted insights."
    >
      <motion.div
        className="text-center space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mx-auto bg-primary/10 w-24 h-24 rounded-full flex items-center justify-center">
          <Mail className="h-12 w-12 text-primary" />
        </div>
        
        <div className="space-y-2">
          <p className="text-muted-foreground">
            We've sent a confirmation link to your email address.
            Click the link to verify your account.
          </p>
          <p className="text-sm text-muted-foreground">
            If you don't see the email, check your spam folder.
          </p>
        </div>
        
        <div className="pt-4">
          <Link to="/auth/signin">
            <CDButton variant="outline" fullWidth>
              Back to sign in
            </CDButton>
          </Link>
        </div>
      </motion.div>
    </AuthLayout>
  );
};

export default ConfirmationPage;
