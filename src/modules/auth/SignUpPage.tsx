
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, Check } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { CDInput } from '@/components/ui-kit/CDInput';
import { CDButton } from '@/components/ui-kit/CDButton';
import { AuthLayout } from './AuthLayout';
import { useAuth } from './AuthContext';

type SignUpFormData = {
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string;
};

const SignUpPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { signUp, isLoading, error } = useAuth();
  const { register, handleSubmit, watch, formState: { errors } } = useForm<SignUpFormData>();
  
  const password = watch('password');

  const onSubmit = async (data: SignUpFormData) => {
    await signUp(data.email, data.password, data.phone);
  };

  return (
    <AuthLayout 
      title="Create an account"
      subtitle="Enter your details to get started"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
            {...register('password', { 
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
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <CDInput
            label="Confirm Password"
            icon={<Lock className="h-4 w-4" />}
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            error={!!errors.confirmPassword}
            errorMessage={errors.confirmPassword?.message}
            {...register('confirmPassword', { 
              required: 'Please confirm your password',
              validate: value => value === password || 'Passwords do not match'
            })}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <CDInput
            label="Phone (Optional)"
            icon={<User className="h-4 w-4" />}
            placeholder="(555) 123-4567"
            helperText="For account recovery and 2FA"
            {...register('phone')}
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
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <CDButton
            fullWidth
            type="submit"
            isLoading={isLoading}
            icon={!isLoading && <Check className="h-4 w-4" />}
            iconPosition="right"
          >
            Create account
          </CDButton>
        </motion.div>

        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
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

export default SignUpPage;
