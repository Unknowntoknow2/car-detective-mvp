
import { DealerSignupForm } from '@/components/dealer/DealerSignupForm';
import { Card } from '@/components/ui/card';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export default function DealerSignup() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold mb-8">Dealer Application</h1>
          <Card className="p-6">
            <DealerSignupForm />
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
