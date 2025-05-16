
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Link } from 'react-router-dom';
import { useDealerSignup } from './hooks/useDealerSignup';
import {
  FullNameField,
  DealershipNameField,
  PhoneField,
  EmailField,
  PasswordField
} from './components/DealerFormFields';
import { Loader2 } from 'lucide-react';

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
        <FullNameField form={form} isLoading={isLoading} />
        
        <DealershipNameField 
          form={form} 
          isLoading={isLoading} 
          dealershipError={dealershipError}
          setDealershipError={setDealershipError}
        />
        
        <PhoneField form={form} isLoading={isLoading} />
        
        <EmailField form={form} isLoading={isLoading} />
        
        <PasswordField form={form} isLoading={isLoading} />

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
