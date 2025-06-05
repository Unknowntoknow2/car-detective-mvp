
import React from "react";
import { Container } from "@/components/ui/container";
import { PremiumValuationForm } from "@/components/premium/form/PremiumValuationForm";
import { EnhancedPremiumFeaturesTabs } from "@/components/premium/features/EnhancedPremiumFeaturesTabs";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PremiumHero } from "@/components/premium/PremiumHero";
import { PremiumTabs } from "@/components/premium/PremiumTabs";
import MainLayout from "@/components/layout/MainLayout";

export default function Premium() {
  const navigate = useNavigate();

  const scrollToForm = () => {
    document.getElementById("premium-form")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-background">
        <PremiumHero scrollToForm={scrollToForm} />

        <div className="py-16 bg-white">
          <Container>
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-8">
                Start Your Premium Valuation
              </h2>
              <PremiumTabs showFreeValuation />
            </div>
          </Container>
        </div>

        <EnhancedPremiumFeaturesTabs />

        <div
          className="py-16 bg-gradient-to-b from-background to-primary/5"
          id="premium-form"
        >
          <Container>
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">
                Premium Valuation Form
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto mb-8">
                Get the most accurate valuation with our premium multi-step form
                that considers every detail of your vehicle.
              </p>
              <div className="flex justify-center gap-4">
                <Button
                  variant="outline"
                  onClick={() => navigate("/valuation")}
                >
                  Back to Basic Valuation
                </Button>
              </div>
            </div>

            <PremiumValuationForm />
          </Container>
        </div>
      </div>
    </MainLayout>
  );
}
