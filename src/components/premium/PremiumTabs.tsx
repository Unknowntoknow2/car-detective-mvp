
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { VinDecoderForm } from "../lookup/VinDecoderForm";
import { Link } from "react-router-dom";

export function PremiumTabs() {
  return (
    <Tabs defaultValue="basic" className="max-w-4xl mx-auto">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="basic">Free Valuation</TabsTrigger>
        <TabsTrigger value="premium">Premium Report</TabsTrigger>
      </TabsList>

      <TabsContent value="basic">
        <Card>
          <CardHeader>
            <CardTitle>Free Valuation</CardTitle>
            <CardDescription>Get a quick, AI-powered estimate based on market data.</CardDescription>
          </CardHeader>
          <CardContent>
            <VinDecoderForm />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="premium">
        <Card className="border-2 border-primary">
          <CardHeader className="bg-primary/5">
            <CardTitle className="flex items-center justify-between">
              Premium Valuation
              <span className="text-lg">$29.99</span>
            </CardTitle>
            <CardDescription>Complete vehicle history and premium insights</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <ul className="space-y-2 mb-6">
              <li className="flex items-center gap-2">
                <span className="text-primary">✓</span>
                Full CARFAX® History Report
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">✓</span>
                Verified Dealer Offers
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">✓</span>
                12-Month Resale Trend Forecast
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">✓</span>
                Detailed Confidence Score
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">✓</span>
                Professional PDF Report
              </li>
            </ul>
            <Button className="w-full" size="lg" asChild>
              <Link to="/premium">Get Premium Report</Link>
            </Button>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
