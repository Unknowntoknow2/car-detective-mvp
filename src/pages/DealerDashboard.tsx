
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { DealerValuationsList } from '@/components/dealer/DealerValuationsList';
import { DealerStats } from '@/components/dealer/DealerStats';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export default function DealerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">Dealer Dashboard</h1>
        <div className="grid gap-6">
          <DealerStats />
          <DealerValuationsList />
        </div>
      </main>
      <Footer />
    </div>
  );
}
