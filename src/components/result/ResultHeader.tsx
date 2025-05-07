
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FileSearch } from 'lucide-react';

interface ResultHeaderProps {
  vehicleName?: string;
}

export const ResultHeader: React.FC<ResultHeaderProps> = ({ vehicleName }) => {
  return (
    <div className="mb-8 flex flex-col lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h1 className="text-3xl font-bold">Valuation Results</h1>
        {vehicleName && (
          <p className="text-muted-foreground mt-2">{vehicleName}</p>
        )}
      </div>
      <Link to="/" className="mt-4 lg:mt-0">
        <Button variant="outline" className="flex items-center gap-2">
          <FileSearch className="h-4 w-4" />
          New Valuation
        </Button>
      </Link>
    </div>
  );
};
