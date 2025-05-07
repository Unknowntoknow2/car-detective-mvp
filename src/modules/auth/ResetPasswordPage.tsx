
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Check } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { CDInput } from '@/components/ui-kit/CDInput';
import { CDButton } from '@/components/ui-kit/CDButton';
import { AuthLayout } from './AuthLayout';
import { useAuth } from './AuthContext';

type ForgotPasswordFormData = {
  email: string;
};

type UpdatePasswordFormData = {
  password: string;
  confirmPassword: string;
};

const ResetPasswordPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { resetPassword, updatePassword, isLoading, error } = useAuth();
  const location = useLocation();
  
  // Check if we're in update password mode (after clicking the reset link from email)
  const isUpdateMode = location.hash.includes('#access_token=');
  
  // Form for requesting a password reset
  const forgotPasswordForm = useForm<ForgotPasswordFormData>();
  
  // Form for setting a new password
  const updatePasswordForm = useForm<UpdatePasswordFormData>();
  
  const password = updatePasswordForm.watch('password');
  
  const handleForgotPassword = async (data: ForgotPasswordFormData) => {
    await resetPassword(data.email);
    setIsSubmitted(true);
  };
  
  const handleUpdatePassword = async (data: UpdatePasswordFormData) => {
    await updatePassword(data.password);
  };

  if (isSubmitted) {
    return (
      <AuthLayout 
        title="Check your email"
        subtitle="Password reset instructions sent"
        quote="Keeping your account secure is part of our commitment to you."
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
              We've sent password reset instructions to your email.
              Click the link in the email to reset your password.
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

  if (isUpdateMode) {
    return (
      <AuthLayout
        title="Set new password"
        subtitle="Enter your new password"
        quote="A strong password is the foundation of a secure account."
      >
        <form onSubmit={updatePasswordForm.handleSubmit(handleUpdatePassword)} className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <CDInput
              label="New Password"
              icon={<Lock className="h-4 w-4" />}
              trailingIcon={showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              onTrailingIconClick={() => setShowPassword(!showPassword)}
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              error={!!updatePasswordForm.formState.errors.password}
              errorMessage={updatePasswordForm.formState.errors.password?.message}
              {...updatePasswordForm.register('password', { 
                required: 'Password is required',
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters'
                }
              })}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <CDInput
              label="Confirm Password"
              icon={<Lock className="h-4 w-4" />}
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              error={!!updatePasswordForm.formState.errors.confirmPassword}
              errorMessage={updatePasswordForm.formState.errors.confirmPassword?.message}
              {...updatePasswordForm.register('confirmPassword', { 
                required: 'Please confirm your password',
                validate: value => value === password || 'Passwords do not match'
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
              icon={!isLoading && <Check className="h-4 w-4" />}
              iconPosition="right"
            >
              Update password
            </CDButton>
          </motion.div>
        </form>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout 
      title="Forgot password"
      subtitle="Enter your email to reset your password"
      quote="Everyone forgets sometimes. We've got you covered."
    >
      <form onSubmit={forgotPasswordForm.handleSubmit(handleForgotPassword)} className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <CDInput
            label="Email"
            icon={<Mail className="h-4 w-4" />}
            placeholder="your@email.com"
            error={!!forgotPasswordForm.formState.errors.email}
            errorMessage={forgotPasswordForm.formState.errors.email?.message}
            {...forgotPasswordForm.register('email', { 
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
            icon={!isLoading && <Mail className="h-4 w-4" />}
            iconPosition="right"
          >
            Send reset link
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

export default ResetPasswordPage;
