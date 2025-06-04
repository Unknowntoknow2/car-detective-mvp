<<<<<<< HEAD

import React from 'react';
import { SEO } from '@/components/layout/seo';
import PremiumValuationForm from '@/components/premium/form/PremiumValuationForm'; 
import { MainLayout } from '@/components/layout';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
=======
import React, { useEffect, useRef, useState } from "react";
import { Container } from "@/components/ui/container";
import { PremiumValuationForm } from "@/components/premium/form/PremiumValuationForm";
import { EnhancedPremiumFeaturesTabs } from "@/components/premium/features/EnhancedPremiumFeaturesTabs";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PremiumHero } from "@/components/premium/PremiumHero";
import { PremiumTabs } from "@/components/premium/PremiumTabs";
import MainLayout from "@/components/layout/MainLayout";
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)

export default function Premium() {
  const navigate = useNavigate();

<<<<<<< HEAD
  const handlePremiumSubmit = (data: any) => {
    // Store the valuation data
    localStorage.setItem('premium_valuation_data', JSON.stringify(data));
    
    // Show success toast
    toast.success('Premium valuation submitted successfully!');
    
    // Navigate to results page (or you could implement a specific premium result page)
    navigate('/result');
  };

  return (
    <MainLayout>
      <SEO title="Premium Valuation" description="Get a premium valuation for your vehicle" />
      <div className="container mx-auto py-8">
        <PremiumValuationForm onSubmit={handlePremiumSubmit} />
=======
  // Track mouse for 3D card effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const rotateY = ((e.clientX - centerX) / (rect.width / 2)) * 5;
        const rotateX = -((e.clientY - centerY) / (rect.height / 2)) * 5;

        setCardRotation({ x: rotateX, y: rotateY });
      }
    };

    globalThis.addEventListener("mousemove", handleMouseMove);
    return () => globalThis.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    // Check if URL has a fragment identifier pointing to the form
    if (globalThis.location.hash === "#premium-form") {
      scrollToForm();
    }

    // Check if there's a canceled payment
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get("canceled") === "true") {
      toast.error(
        "Payment was canceled. Please try again if you want to unlock premium features.",
      );
    }
  }, [location]);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-background">
        <PremiumHero scrollToForm={scrollToForm} />

        <div className="py-16 bg-white" ref={featuresRef}>
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
          ref={formRef}
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
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
      </div>
    </MainLayout>
  );
}
