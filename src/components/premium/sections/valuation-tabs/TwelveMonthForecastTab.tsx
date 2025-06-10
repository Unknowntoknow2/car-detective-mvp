
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export interface TwelveMonthForecastTabProps {
  vehicleData?: {
    make: string;
    model: string;
    year: number;
    trim?: string;
    vin?: string;
  };
}

export function TwelveMonthForecastTab({ vehicleData }: TwelveMonthForecastTabProps) {
  // Mock forecast data
  const forecastData = [
    { month: "Jan", value: 25000 },
    { month: "Feb", value: 24800 },
    { month: "Mar", value: 24600 },
    { month: "Apr", value: 24400 },
    { month: "May", value: 24200 },
    { month: "Jun", value: 24000 },
    { month: "Jul", value: 23800 },
    { month: "Aug", value: 23600 },
    { month: "Sep", value: 23400 },
    { month: "Oct", value: 23200 },
    { month: "Nov", value: 23000 },
    { month: "Dec", value: 22800 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>12-Month Value Forecast</CardTitle>
        {vehicleData && (
          <p className="text-sm text-gray-600">
            {vehicleData.year} {vehicleData.make} {vehicleData.model}
          </p>
        )}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={forecastData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value) => [`$${value?.toLocaleString()}`, "Estimated Value"]} />
            <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
