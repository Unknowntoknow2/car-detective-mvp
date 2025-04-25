
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PremiumValuationForm } from '@/components/premium/form/PremiumValuationForm';
import { AnnouncementBar } from '@/components/marketing/AnnouncementBar';

export default function PremiumValuationPage() {
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
          
          <PremiumValuationForm />
        </div>
      </main>
      <Footer />
    </div>
  );
}
