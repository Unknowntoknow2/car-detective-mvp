
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Link } from 'react-router-dom';
import { useDealerSignup } from './hooks/useDealerSignup';
import { Loader2 } from 'lucide-react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

export function DealerSignupForm() {
  const {
    form,
    isLoading,
    dealershipError,
    setDealershipError,
    onSubmit
  } = useDealerSignup();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        {/* Full Name Field */}
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="John Doe" 
                  disabled={isLoading} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Dealership Name Field */}
        <FormField
          control={form.control}
          name="dealershipName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dealership Name</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="ABC Motors" 
                  disabled={isLoading}
                  onChange={(e) => {
                    field.onChange(e);
                    setDealershipError(null);
                  }}
                />
              </FormControl>
              {dealershipError && (
                <p className="text-xs text-red-500 mt-1">{dealershipError}</p>
              )}
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Phone Field */}
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="(555) 123-4567" 
                  disabled={isLoading} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Email Field */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  type="email"
                  placeholder="you@example.com" 
                  disabled={isLoading} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Password Field */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  type="password"
                  placeholder="Enter a secure password" 
                  disabled={isLoading} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          className="w-full" 
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Account...
            </>
          ) : (
            'Create Dealer Account'
          )}
        </Button>

        <div className="text-center mt-4">
          <Link to="/login-dealer" className="text-primary hover:underline text-sm">
            Already have a dealer account? Login here
          </Link>
        </div>
      </form>
    </Form>
  );
}
