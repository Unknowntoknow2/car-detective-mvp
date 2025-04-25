
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PremiumValuationForm } from '@/components/premium/form/PremiumValuationForm';
import { AnnouncementBar } from '@/components/marketing/AnnouncementBar';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function PremiumValuationPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50">
      <AnnouncementBar />
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Premium Vehicle Valuation
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Complete all steps to get a comprehensive and accurate valuation of your vehicle.
            </p>
          </div>
          
          {user ? (
            <PremiumValuationForm />
          ) : (
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <h2 className="text-xl font-semibold mb-4">Authentication Required</h2>
              <p className="mb-6">You need to be logged in to create a premium valuation.</p>
              <Button asChild>
                <Link to="/auth">Sign In / Register</Link>
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
