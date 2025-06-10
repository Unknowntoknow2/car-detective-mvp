
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface CarData {
  id: number;
  make: string;
  model: string;
  year: number;
  image: string;
  description: string;
}

interface CarCardProps {
  car: CarData;
}

export const CarCard: React.FC<CarCardProps> = ({ car }) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="text-lg">
          {car.year} {car.make} {car.model}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="aspect-video bg-gray-100 rounded-md mb-4 flex items-center justify-center">
          <span className="text-gray-500">Vehicle Image</span>
        </div>
        <p className="text-sm text-gray-600 mb-4">{car.description}</p>
        <Button className="w-full">View Details</Button>
      </CardContent>
    </Card>
  );
};
