
import React, { useEffect, useState } from 'react';
import { executeMakesModelsQuery } from '@/utils/queryMakesModels';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface MakeWithModels {
  make: string;
  models: string[];
}

export const MakesModelsDisplay: React.FC = () => {
  const [makesData, setMakesData] = useState<MakeWithModels[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await executeMakesModelsQuery();
        setMakesData(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch makes and models');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading makes and models...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-600 bg-red-50 rounded-lg">
        Error: {error}
      </div>
    );
  }

  const totalModels = makesData.reduce((sum, make) => sum + make.models.length, 0);

  return (
    <div className="p-6 space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg">
        <h2 className="text-xl font-bold mb-2">Database Summary</h2>
        <p><strong>Total Makes:</strong> {makesData.length}</p>
        <p><strong>Total Models:</strong> {totalModels}</p>
      </div>

      <div className="grid gap-4">
        {makesData.map((makeData, index) => (
          <Card key={makeData.make} className="p-4">
            <h3 className="font-semibold text-lg mb-2">
              {index + 1}. {makeData.make} ({makeData.models.length} models)
            </h3>
            <div className="grid grid-cols-3 gap-2 text-sm">
              {makeData.models.map((model, modelIndex) => (
                <div key={model} className="bg-gray-100 p-2 rounded">
                  {modelIndex + 1}. {model}
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
