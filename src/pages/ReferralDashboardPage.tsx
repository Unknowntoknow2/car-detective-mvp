import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Users, DollarSign, TrendingUp, Share2 } from "lucide-react";
import { toast } from "sonner";
import { Navbar } from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ReferralModal } from "@/components/referrals/ReferralModal";

export default function ReferralDashboardPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [referralStats, setReferralStats] = useState({
    totalReferrals: 0,
    pendingReferrals: 0,
    completedReferrals: 0,
    earnings: 0,
  });

  useEffect(() => {
    // Fetch referral stats
    // This would be replaced with an actual API call
    setReferralStats({
      totalReferrals: 12,
      pendingReferrals: 3,
      completedReferrals: 9,
      earnings: 450,
    });
  }, []);

  const handleCopyReferralCode = () => {
    navigator.clipboard.writeText("REF123");
    toast.success("Referral code copied to clipboard!");
  };

  const handleShareReferral = () => {
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Referral Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Track your referrals and earnings
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={handleCopyReferralCode}
            >
              <Copy className="h-4 w-4" />
              Copy Referral Code
            </Button>
            
            <Button
              className="flex items-center gap-2"
              onClick={handleShareReferral}
            >
              <Share2 className="h-4 w-4" />
              Share Referral Link
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Total Referrals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Users className="h-5 w-5 text-blue-500 mr-2" />
                <span className="text-2xl font-bold">
                  {referralStats.totalReferrals}
                </span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Pending Referrals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <TrendingUp className="h-5 w-5 text-yellow-500 mr-2" />
                <span className="text-2xl font-bold">
                  {referralStats.pendingReferrals}
                </span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Completed Referrals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Users className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-2xl font-bold">
                  {referralStats.completedReferrals}
                </span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Total Earnings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <DollarSign className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-2xl font-bold">
                  ${referralStats.earnings}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Referrals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">User{item}@example.com</p>
                    <p className="text-sm text-gray-500">
                      Referred on {new Date().toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant={item === 1 ? "outline" : "default"}>
                    {item === 1 ? "Pending" : "Completed"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
      
      <ReferralModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        referralCode="REF123"
      />
      
      <Footer />
    </div>
  );
}
