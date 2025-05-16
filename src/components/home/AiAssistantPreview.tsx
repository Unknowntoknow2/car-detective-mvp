
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar } from '@/components/ui/avatar';
import { MessageSquare, Send } from 'lucide-react';

const exampleQuestions = [
  "What affects my car's value the most?",
  "How does mileage impact resale value?",
  "What documents do I need to sell my car?",
  "Is it better to sell privately or to a dealer?"
];

const exampleAnswers = {
  "What affects my car's value the most?": 
    "The biggest factors affecting your car's value are: 1) Mileage (lower is better), 2) Condition (visible damage reduces value), 3) Service history (regular maintenance increases value), 4) Market demand (popular models retain value better), and 5) Vehicle age. Our AI analysis weighs these factors based on current market data.",
  
  "How does mileage impact resale value?": 
    "For most vehicles, every 10,000 miles above average (12,000 miles/year) decreases value by 5-8%. Your vehicle's specific depreciation curve may vary based on make/model. Premium vehicles often experience steeper mileage-based depreciation, while reliable everyday models like Honda and Toyota tend to hold value better at higher mileages.",
  
  "What documents do I need to sell my car?": 
    "You'll need: 1) Clear vehicle title (most important), 2) Maintenance records, 3) Bill of sale, 4) Release of liability form, 5) Warranty documents if applicable, and 6) Vehicle history report (like CARFAX). Having complete documentation can increase buyer confidence and help you command a better price.",
  
  "Is it better to sell privately or to a dealer?": 
    "Selling privately typically nets 10-15% more money but requires more effort (listings, showing the car, paperwork). Selling to a dealer is faster and easier but usually offers less money. If your vehicle is in excellent condition with lower mileage, the private sale premium is often worth pursuing."
};

export function AiAssistantPreview() {
  const [question, setQuestion] = useState('');
  const [conversation, setConversation] = useState<{role: 'user' | 'assistant', content: string}[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const handleQuestionClick = (q: string) => {
    if (!conversation.length) {
      askQuestion(q);
    }
  };

  const askQuestion = (q: string) => {
    // Add user message
    setConversation(prev => [...prev, {role: 'user', content: q}]);
    setQuestion('');
    setIsTyping(true);
    
    // Simulate typing delay
    setTimeout(() => {
      setIsTyping(false);
      // Add AI response
      const answer = exampleAnswers[q as keyof typeof exampleAnswers] || 
        "I don't have specific information on that yet, but with a premium valuation, I can provide detailed insights about your specific vehicle's value factors.";
      
      setConversation(prev => [...prev, {role: 'assistant', content: answer}]);
    }, 1500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim()) {
      askQuestion(question);
    }
  };

  return (
    <Card className="w-full shadow-md border-muted-foreground/20">
      <CardHeader className="bg-surface-light pb-2">
        <CardTitle className="flex items-center gap-2 text-xl font-semibold">
          <MessageSquare className="h-5 w-5 text-primary" />
          <span>AI Assistant Preview</span>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Ask questions about car values, market trends, or selling tips
        </p>
      </CardHeader>
      
      <CardContent className="p-4">
        <div className="mb-4 space-y-4 h-[280px] overflow-y-auto">
          {conversation.length === 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {exampleQuestions.map((q, idx) => (
                <Button 
                  key={idx} 
                  variant="outline" 
                  className="justify-start h-auto py-2 text-left hover:bg-muted"
                  onClick={() => handleQuestionClick(q)}
                >
                  <span className="truncate">{q}</span>
                </Button>
              ))}
            </div>
          ) : (
            <>
              {conversation.map((message, idx) => (
                <div key={idx} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex items-start gap-2 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <Avatar className={`h-8 w-8 ${message.role === 'user' ? 'bg-primary' : 'bg-muted'}`}>
                      {message.role === 'user' ? 'U' : 'AI'}
                    </Avatar>
                    <div className={`rounded-lg px-3 py-2 text-sm ${
                      message.role === 'user' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted text-foreground'
                    }`}>
                      {message.content}
                    </div>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-start gap-2 max-w-[80%]">
                    <Avatar className="h-8 w-8 bg-muted">AI</Avatar>
                    <div className="rounded-lg px-3 py-2 text-sm bg-muted text-foreground">
                      <div className="flex gap-1">
                        <div className="animate-bounce">.</div>
                        <div className="animate-bounce delay-75">.</div>
                        <div className="animate-bounce delay-150">.</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="border-t bg-muted/20 p-2">
        <form onSubmit={handleSubmit} className="w-full flex gap-2">
          <Input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask about car values, market trends, or selling tips..."
            className="flex-1"
          />
          <Button type="submit" size="sm" disabled={!question.trim() || isTyping}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
