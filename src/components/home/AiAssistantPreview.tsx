
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Bot } from 'lucide-react';

export function AiAssistantPreview() {
  const [question, setQuestion] = useState('');

  const sampleQuestions = [
    "What factors affect my car's value?",
    "How accurate are your valuations?",
    "What's the difference between trade-in and private sale value?",
    "How often should I check my car's value?"
  ];

  const handleQuestionClick = (q: string) => {
    setQuestion(q);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-blue-600" />
          AI Valuation Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Ask about vehicle valuations..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="flex-1"
          />
          <Button size="sm">
            <Send className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="space-y-2">
          <p className="text-sm text-gray-600">Try asking:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {sampleQuestions.map((q, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="text-left justify-start h-auto p-2 text-xs"
                onClick={() => handleQuestionClick(q)}
              >
                {q}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default AiAssistantPreview;
