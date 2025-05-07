
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, Check } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { CDInput } from '@/components/ui-kit/CDInput';
import { CDButton } from '@/components/ui-kit/CDButton';
import { AuthLayout } from './AuthLayout';
import { useAuth } from './AuthContext';

type SignInFormData = {
  email: string;
  password: string;
};

const SignInPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { signIn, isLoading, error } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm<SignInFormData>();

  const onSubmit = async (data: SignInFormData) => {
    await signIn(data.email, data.password);
  };

  return (
    <AuthLayout 
      title="Welcome back"
      subtitle="Enter your credentials to sign in"
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <CDInput
            label="Password"
            icon={<Lock className="h-4 w-4" />}
            trailingIcon={showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            onTrailingIconClick={() => setShowPassword(!showPassword)}
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            error={!!errors.password}
            errorMessage={errors.password?.message}
            {...register('password', { required: 'Password is required' })}
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
          className="flex items-center justify-between"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Link 
            to="/auth/forgot-password"
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            Forgot password?
          </Link>
          <Link 
            to="/auth/magic-link"
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            Sign in with magic link
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <CDButton
            fullWidth
            type="submit"
            isLoading={isLoading}
            icon={!isLoading && <Check className="h-4 w-4" />}
            iconPosition="right"
          >
            Sign in
          </CDButton>
        </motion.div>

        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <p className="text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link 
              to="/auth/signup"
              className="font-medium text-primary hover:underline"
            >
              Sign up
            </Link>
          </p>
        </motion.div>
      </form>
    </AuthLayout>
  );
};

export default SignInPage;
