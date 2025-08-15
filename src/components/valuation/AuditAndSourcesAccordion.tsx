import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import ProcessAuditTrail from './ProcessAuditTrail';
import { WhyNotCountedCard } from './WhyNotCountedCard';
import { EnhancedValuationResult } from '@/types/valuation';

interface AuditAndSourcesAccordionProps {
  result: EnhancedValuationResult;
}

export function AuditAndSourcesAccordion({ result }: AuditAndSourcesAccordionProps) {
  const featureAuditEnabled = import.meta.env.VITE_FEATURE_AUDIT === '1';
  
  if (!featureAuditEnabled || !result.processAuditTrail) {
    return null;
  }

  const { processAuditTrail } = result;

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="audit-sources">
        <AccordionTrigger className="text-left">
          <div className="flex flex-col items-start">
            <span className="font-medium">Process Audit & Data Sources</span>
            <span className="text-sm text-muted-foreground">
              {processAuditTrail.includedListings} included, {processAuditTrail.excludedListings} excluded listings
            </span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="space-y-4">
          {/* Why Not Counted Section */}
          {processAuditTrail.exclusionReasons.length > 0 && (
            <WhyNotCountedCard excluded={processAuditTrail.exclusionReasons} />
          )}
          
          {/* Process Audit Trail */}
          <ProcessAuditTrail valuationId={processAuditTrail.valuationId} />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}