
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, Check } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { CDInput } from '@/components/ui-kit/CDInput';
import { CDButton } from '@/components/ui-kit/CDButton';
import { AuthLayout } from './AuthLayout';
import { useAuth } from './AuthContext';

type MagicLinkFormData = {
  email: string;
};

const MagicLinkPage: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { sendMagicLink, isLoading, error } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm<MagicLinkFormData>();

  const onSubmit = async (data: MagicLinkFormData) => {
    await sendMagicLink(data.email);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <AuthLayout 
        title="Check your email"
        subtitle="We've sent you a magic link"
        quote="Verification is the first step to accurate valuation."
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
              We've sent a magic link to your email address. Click the link to sign in.
            </p>
            <p className="text-sm text-muted-foreground">
              The link will expire in 10 minutes.
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
  }

  return (
    <AuthLayout 
      title="Sign in with magic link"
      subtitle="We'll send you a secure link to your email"
      quote="No password needed, just a click away from your valuations."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <CDInput
            label="Email"
            icon={<Mail className="h-4 w-4" />}
            placeholder="your@email.com"
            error={!!errors.email}
            errorMessage={errors.email?.message}
            {...register('email', { 
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address'
              }
            })}
          />
        </motion.div>

        {error && (
          <motion.div
            className="bg-destructive/10 text-destructive p-3 rounded-md text-sm"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            {error}
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <CDButton
            fullWidth
            type="submit"
            isLoading={isLoading}
            icon={!isLoading && <ArrowRight className="h-4 w-4" />}
            iconPosition="right"
          >
            Send magic link
          </CDButton>
        </motion.div>

        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <p className="text-sm text-muted-foreground">
            Remember your password?{' '}
            <Link 
              to="/auth/signin"
              className="font-medium text-primary hover:underline"
            >
              Sign in
            </Link>
          </p>
        </motion.div>
      </form>
    </AuthLayout>
  );
};

export default MagicLinkPage;
