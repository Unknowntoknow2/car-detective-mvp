
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SectionHeader } from "@/components/ui/design-system";
import { Button } from "@/components/ui/button";
import { CarFront, Search, FileText, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RefObject } from 'react';
import PremiumValuationSection from './PremiumValuationSection';

interface ValuationFormProps {
  formRef: RefObject<HTMLDivElement>;
}

export function ValuationForm({ formRef }: ValuationFormProps) {
  return (
    <section ref={formRef} id="premium-valuation" className="py-20 px-4 bg-gradient-to-b from-surface to-background">
      <PremiumValuationSection />
    </section>
  );
}
