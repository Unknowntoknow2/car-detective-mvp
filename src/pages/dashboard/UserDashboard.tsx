
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ValuationResult } from '@/types/valuation';
import { getUserValuations } from '@/utils/valuationService';
import { formatCurrency } from '@/utils/formatters';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { downloadPdf, openValuationPdf } from '@/utils/pdf/generateValuationPdf';

interface VehicleCardProps {
  vehicle: ValuationResult;
}

// Only modify the part that has the error
function VehicleCard({ vehicle }: VehicleCardProps) {
  const handleDownloadPdf = () => {
    if (!vehicle) return;
    
    // Create report data with necessary fields
    const reportData = {
      year: vehicle.year,
      make: vehicle.make,
      model: vehicle.model,
      trim: vehicle.trim || '',
      vin: vehicle.vin || '',
      mileage: vehicle.mileage || 0,
      estimatedValue: vehicle.estimatedValue || 0,
      photoScore: vehicle.photoScore || 0,
      bestPhotoUrl: vehicle.photoUrl || '',
    };
    
    // Call PDF generation function
    openValuationPdf(reportData);
  };

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle>{vehicle.year} {vehicle.make} {vehicle.model}</CardTitle>
        <CardDescription>
          Estimated Value: {formatCurrency(vehicle.estimatedValue)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>VIN: {vehicle.vin || 'N/A'}</p>
        <p>Mileage: {vehicle.mileage ? vehicle.mileage.toLocaleString() : 'N/A'}</p>
        <Button variant="outline" onClick={handleDownloadPdf}>
          Download PDF
        </Button>
      </CardContent>
    </Card>
  );
}

const UserDashboard = () => {
  const { user } = useAuth();
  const [valuations, setValuations] = useState<ValuationResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchValuationHistory = async () => {
      setIsLoading(true);
      setError(null);
      try {
        if (user) {
          const history = await getUserValuations(user.id);
          setValuations(history);
        } else {
          setError('User not authenticated.');
        }
      } catch (err) {
        setError('Failed to load valuation history.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchValuationHistory();
  }, [user]);

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">
        Welcome to your Dashboard!
      </h1>

      {user ? (
        <div className="flex items-center space-x-4 mb-8">
          <Avatar>
            <AvatarImage src={user.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${user.email}`} />
            <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-xl font-semibold">
              {user.user_metadata?.full_name || user.email}
            </h2>
            <p className="text-muted-foreground">
              {user.email}
            </p>
          </div>
        </div>
      ) : (
        <p className="text-red-500">Not logged in.</p>
      )}

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          Your Recent Valuations
        </h2>
        {isLoading && <p>Loading valuation history...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {valuations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {valuations.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        ) : (
          <p>No recent valuations found.</p>
        )}
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">
          Get Started
        </h2>
        <p className="mb-4">
          Ready to find out the value of your vehicle?
        </p>
        <Link to="/valuation" className="inline-block">
          <Button>
            New Valuation
          </Button>
        </Link>
      </section>
    </div>
  );
};

// Export the component
export default UserDashboard;
