import React, { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { AnnouncementBar } from "@/components/marketing/AnnouncementBar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export default function FreeValuationPage() {
  const [selectedTab, setSelectedTab] = useState("vin");

  const features = [
    {
      title: "Instant VIN Decoding",
      description: "Get detailed vehicle specifications from VIN"
    },
    {
      title: "Market Value Analysis", 
      description: "Compare against current market listings"
    },
    {
      title: "Professional Report",
      description: "Detailed PDF report for your records"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <AnnouncementBar />
      <Navbar />
      
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Free Vehicle Valuation
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get an accurate estimate of your vehicle's worth with our AI-powered valuation tool.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
          {features.map((feature, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Start Your Free Valuation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button className="w-full" size="lg">
                  Get Started
                </Button>
                <p className="text-sm text-gray-500 text-center">
                  No registration required • Instant results
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
