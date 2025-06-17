import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function StatsPage() {
  const [activeUsers, setActiveUsers] = useState<number>(0);
  const [totalValuations, setTotalValuations] = useState<number>(0);
  const [premiumUsers, setPremiumUsers] = useState<number>(0);
  const [conversionRate, setConversionRate] = useState<number>(0);

  useEffect(() => {
    // Mock data loading
    setActiveUsers(1250);
    setTotalValuations(15680);
    setPremiumUsers(320);
    setConversionRate(25.6);
  }, []);

  const mockStats = [
    { label: "Active Users", value: activeUsers, trend: "+12%" },
    { label: "Total Valuations", value: totalValuations, trend: "+8%" },
    { label: "Premium Users", value: premiumUsers, trend: "+15%" },
    { label: "Conversion Rate", value: `${conversionRate}%`, trend: "+3%" }
  ];

  const mockReferrers = [
    { source: "Google", visits: 5420, percentage: 45 },
    { source: "Direct", visits: 3210, percentage: 27 },
    { source: "Social Media", visits: 2100, percentage: 18 },
    { source: "Other", visits: 1270, percentage: 10 }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Platform Statistics</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {mockStats.map((stat: any, index: number) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold">{stat.label}</h3>
                <p className="text-2xl font-bold">{stat.value}</p>
                <span className="text-green-600">{stat.trend}</span>
              </div>
            ))}
          </div>

          <div className="bg-white p-6 rounded-lg shadow mb-8">
            <h2 className="text-xl font-bold mb-4">Usage Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {mockStats.reduce((acc: any, stat: any) => {
                return acc + (typeof stat.value === 'number' ? stat.value : 0);
              }, 0) > 0 && (
                <div className="text-center">
                  <p className="text-lg font-medium">Total Interactions</p>
                  <p className="text-2xl font-bold">
                    {mockStats.filter((s: any) => typeof s.value === 'number')
                      .reduce((sum: number, stat: any) => sum + stat.value, 0)}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Traffic Sources</h2>
            <div className="space-y-4">
              {mockReferrers
                .sort((a: any, b: any) => b.visits - a.visits)
                .map((referrer: any, index: number) => (
                  <div key={index} className="flex justify-between items-center">
                    <span>{referrer.source}</span>
                    <div className="flex items-center gap-2">
                      <span>{referrer.visits} visits</span>
                      <span className="text-muted-foreground">({referrer.percentage}%)</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
