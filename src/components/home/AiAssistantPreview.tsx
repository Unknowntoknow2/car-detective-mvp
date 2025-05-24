
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, MessageCircle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { AIAssistantDrawer } from '@/components/chat/AIAssistantDrawer';

const sampleQuestions = [
  "What's my 2020 Honda Civic worth?",
  "Should I trade in or sell privately?",
  "How do market trends affect my car's value?",
  "What premium features add value to my vehicle?"
];

export const AiAssistantPreview: React.FC = () => {
  const [selectedQuestion, setSelectedQuestion] = useState(0);
  const [isAIOpen, setIsAIOpen] = useState(false);

  const sampleResponses = [
    "Based on current market data, a 2020 Honda Civic typically ranges from $18,000-$22,000 depending on mileage, condition, and trim level. For a precise valuation, I'll need to know your specific mileage, condition, and ZIP code. Would you like to start a free valuation?",
    "Great question! Generally, selling privately gets you 10-15% more money than trading in, but takes more time and effort. Trade-ins are convenient and immediate. With our premium reports, I can show you both private party and trade-in values for your specific vehicle.",
    "Market trends significantly impact values. Right now, used car demand remains strong, especially for reliable brands like Honda and Toyota. Seasonal factors, gas prices, and new car availability all affect pricing. I can provide current market insights for your specific vehicle.",
    "Premium features like navigation, leather seats, sunroofs, and advanced safety features can add $1,000-$5,000 to your vehicle's value. The impact depends on the make, model, and target market. Would you like me to evaluate how your specific features affect value?"
  ];

  const handleStartChat = () => {
    setIsAIOpen(true);
  };

  const handleCloseChat = () => {
    setIsAIOpen(false);
  };

  return (
    <>
      <Card className="w-full max-w-2xl mx-auto border-primary/20 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-full">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">AIN — Auto Intelligence Network™</h3>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  AI-Powered Vehicle Assistant
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-1 text-xs text-primary font-medium">
              <MessageCircle className="h-3 w-3" />
              <span>GPT-4o Powered</span>
            </div>
          </div>

          <div className="space-y-4">
            {/* Sample Questions */}
            <div>
              <p className="text-sm font-medium mb-3">Try asking:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {sampleQuestions.map((question, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedQuestion(index)}
                    className={`text-left p-3 rounded-lg border text-sm transition-colors ${
                      selectedQuestion === index
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    {question}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Sample Response */}
            <div className="bg-muted rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="flex items-center justify-center w-6 h-6 bg-primary rounded-full flex-shrink-0 mt-0.5">
                  <Sparkles className="h-3 w-3 text-white" />
                </div>
                <div className="flex-1">
                  <motion.p
                    key={selectedQuestion}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-sm text-muted-foreground leading-relaxed"
                  >
                    {sampleResponses[selectedQuestion]}
                  </motion.p>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="text-center">
                <div className="text-lg font-semibold text-primary">Real-time</div>
                <div className="text-xs text-muted-foreground">Market Data</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-primary">CARFAX®</div>
                <div className="text-xs text-muted-foreground">Integration</div>
              </div>
            </div>

            {/* CTA */}
            <Button onClick={handleStartChat} className="w-full mt-4 group" size="lg">
              Start Chatting with AIN
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* AI Assistant Drawer */}
      <AIAssistantDrawer isOpen={isAIOpen} onClose={handleCloseChat} />
    </>
  );
};

export default AiAssistantPreview;
