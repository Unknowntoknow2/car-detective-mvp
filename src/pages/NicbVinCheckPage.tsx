
import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { isValidVIN } from '@/utils/validation/vin-validation-helpers';
import { useNicbVinCheck } from '@/hooks/useNicbVinCheck';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from 'lucide-react';

export default function NicbVinCheckPage() {
  const [vin, setVin] = useState('');
  const { data, loading, error, checkVin } = useNicbVinCheck();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isValidVIN(vin)) {
      await checkVin(vin);
    } else {
      alert('Please enter a valid 17-character VIN.');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />
      <main className="flex-1 container mx-auto py-6 px-4">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>NICB VIN Check</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  type="text"
                  placeholder="Enter 17-character VIN"
                  value={vin}
                  onChange={(e) => setVin(e.target.value.toUpperCase())}
                  className="w-full"
                />
              </div>
              <Button disabled={loading} className="w-full">
                {loading ? 'Checking...' : 'Check VIN'}
              </Button>
            </form>
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {data && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold">Results</h3>
                <p>VIN: {data.vin}</p>
                <p>Is Stolen: {data.is_stolen ? 'Yes' : 'No'}</p>
                <p>Is Recovered: {data.is_recovered ? 'Yes' : 'No'}</p>
                <p>Has Title Issues: {data.has_title_issues ? 'Yes' : 'No'}</p>
                {data.theft_date && <p>Theft Date: {data.theft_date}</p>}
                {data.recovery_date && <p>Recovery Date: {data.recovery_date}</p>}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
