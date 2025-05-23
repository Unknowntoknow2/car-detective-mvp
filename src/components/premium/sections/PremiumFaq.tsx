
import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export const PremiumFaq: React.FC = () => {
  const faqItems = [
    {
      question: "What makes the premium valuation different from the free version?",
      answer: "Our premium valuation offers a comprehensive analysis that includes feature-by-feature value impact, CARFAX report integration, detailed condition assessment, market trend analysis, and a professional PDF report. The free valuation gives you a basic estimate without these detailed insights."
    },
    {
      question: "How accurate is the premium valuation?",
      answer: "Our premium valuations achieve a 92-96% accuracy rate when compared to actual selling prices. We use a combination of real-time market data, historical sales, and AI-powered analytics to provide the most accurate value possible."
    },
    {
      question: "Can I use the premium valuation report when selling to a dealer?",
      answer: "Absolutely! Many of our users report successful negotiations with dealerships using our premium reports. The detailed breakdown gives you leverage by showing exactly why your vehicle is worth what we've estimated."
    },
    {
      question: "Do I need a CARFAX report before getting a premium valuation?",
      answer: "No, our system integrates with CARFAX and automatically retrieves the relevant history when you enter your VIN. This history is factored into your valuation without any additional steps required."
    },
    {
      question: "How long does it take to get my premium valuation?",
      answer: "Premium valuations are typically processed within 2-5 minutes, depending on data availability. Once complete, your report is immediately available for download and is also emailed to you."
    },
    {
      question: "Can I get a refund if I'm not satisfied?",
      answer: "Yes, we offer a 100% satisfaction guarantee. If you're not happy with your premium valuation for any reason, contact our support team within 7 days for a full refund."
    },
  ];

  return (
    <section className="py-12 bg-muted/30">
      <div className="container">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-3">Frequently Asked Questions</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about our premium valuation service
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
                <AccordionContent>{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};
