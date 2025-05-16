
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Toaster } from 'sonner';

export default function HomePage() {
  const { user, userRole } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster richColors position="top-center" />
      
      <div className="container mx-auto px-4 py-12">
        <header className="flex justify-between items-center mb-12">
          <h1 className="text-3xl font-bold">Car Perfector</h1>
          
          <div className="space-x-2">
            {user ? (
              <>
                <Button asChild variant="outline">
                  <Link to={userRole === 'dealer' ? '/dealer/dashboard' : '/dashboard'}>
                    Dashboard
                  </Link>
                </Button>
                <Button asChild>
                  <Link to="/valuations/new">
                    New Valuation
                  </Link>
                </Button>
              </>
            ) : (
              <>
                <Button asChild variant="outline">
                  <Link to="/sign-in">
                    Sign In
                  </Link>
                </Button>
                <Button asChild>
                  <Link to="/sign-up">
                    Sign Up
                  </Link>
                </Button>
              </>
            )}
          </div>
        </header>
        
        <main>
          <section className="text-center py-20">
            <h2 className="text-4xl font-bold mb-6">Get the Perfect Valuation for Your Car</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Accurate, data-driven car valuations to help you sell, buy, or trade your vehicle with confidence.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
              <Button size="lg" asChild>
                <Link to={user ? "/valuations/new" : "/sign-up"}>
                  {user ? "Start New Valuation" : "Create a Free Account"}
                </Link>
              </Button>
              
              <Button size="lg" variant="outline" asChild>
                <Link to="/dealer/sign-up">
                  Register as a Dealer
                </Link>
              </Button>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
