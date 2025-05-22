
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import NicbVinCheck from '@/components/valuation/NicbVinCheck';

const NicbVinCheckPage: React.FC = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-2">NICB VIN Check</h1>
      <p className="text-muted-foreground mb-6">
        Check if a vehicle has been reported stolen or has title issues
      </p>
      
      <Card>
        <CardHeader>
          <CardTitle>Vehicle Theft & Title Check</CardTitle>
          <CardDescription>
            Enter a VIN to check the National Insurance Crime Bureau (NICB) database
          </CardDescription>
        </CardHeader>
        <CardContent>
          <NicbVinCheck />
        </CardContent>
      </Card>
      
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">About NICB VIN Check</h2>
        <div className="prose max-w-none">
          <p>
            The NICB VIN Check is a free service provided by the National Insurance Crime 
            Bureau to help consumers identify potentially stolen vehicles or vehicles with 
            salvage or title issues.
          </p>
          <p>
            This tool checks against the NICB's database which contains information on:
          </p>
          <ul>
            <li>Vehicles reported as stolen and unrecovered</li>
            <li>Vehicles reported as stolen and later recovered</li>
            <li>Vehicles with salvage or other title issues</li>
          </ul>
          <p>
            <strong>Note:</strong> While the NICB VIN Check is a valuable resource, it should not 
            be your only source of information when purchasing a used vehicle. Always consider 
            getting a comprehensive vehicle history report and having the vehicle inspected by 
            a trusted mechanic.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NicbVinCheckPage;
