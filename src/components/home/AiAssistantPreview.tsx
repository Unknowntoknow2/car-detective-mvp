import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';

const exampleAnswers = {
  "What is my car worth?": 
    "I can help you determine your car's value based on market data, condition, and features. Would you like to enter your VIN or vehicle details to get started with a valuation?",
  
  "How does my mileage affect value?": 
    "Mileage significantly impacts value. Generally, every 10,000 miles over average (12,000 miles/year) reduces value by 5-8%. For example, a 5-year-old car with 80,000 miles instead of the average 60,000 might be worth 8-16% less. Premium vehicles and certain models depreciate faster with high mileage.",
  
  "What documents do I need when selling my car?": 
    "You'll need: 1) Clear vehicle title (most important), 2) Maintenance records, 3) Bill of sale, 4) Release of liability form, 5) Warranty documents if applicable, and 6) Vehicle history report (like CARFAX). Having complete documentation can increase buyer confidence and help you command a better price.",
  
  "Is it better to sell privately or to a dealer?": 
    "Selling privately typically nets 10-15% more money but requires more effort (listings, showing the car, paperwork). Selling to a dealer is faster and easier but usually offers less money. If your vehicle is in excellent condition with lower mileage, the private sale premium is often worth pursuing.",
    
  "what about my car": 
    "To give you specific insights about your car, I'd need some details like make, model, year, mileage, and condition. Once you provide this information, I can tell you about its estimated value, market trends, and factors affecting its worth. Would you like to provide those details or start with a VIN lookup?",
    
  "how are you": 
    "I'm here and ready to help with any car valuation questions you have! Whether you're wondering about your vehicle's value, market trends, or selling strategies, I can provide insights based on current data. What specific information about cars or valuations can I help you with today?"
};

export function AiAssistantPreview() {
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState<{role: 'user' | 'assistant', content: string}[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  
  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    // Add user message
    const q = message.trim();
    setConversation(prev => [...prev, {role: 'user', content: q}]);
    setMessage('');
    
    // Simulate AI typing response
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      // Add AI response
      const answer = exampleAnswers[q as keyof typeof exampleAnswers] || 
        "To give you specific insights about your vehicle, I'd need some details like make, model, year, and mileage. Would you like to provide that information or run a full valuation?";
      
      setConversation(prev => [...prev, {role: 'assistant', content: answer}]);
    }, 1500);
  };
  
  return (
    <div className="bg-gray-50 rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold mb-4">AI Assistant Preview</h2>
      
      <div className="space-y-4">
        {conversation.map((msg, index) => (
          <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
            {msg.role === 'assistant' && (
              <Avatar className="h-8 w-8">
                <AvatarImage src="https://github.com/shadcn.png" alt="AI Assistant" />
                <AvatarFallback>AI</AvatarFallback>
              </Avatar>
            )}
            
            <div className={`rounded-lg p-3 text-sm w-3/4 ${
              msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-gray-100 text-gray-800'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex items-start gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src="https://github.com/shadcn.png" alt="AI Assistant" />
              <AvatarFallback>AI</AvatarFallback>
            </Avatar>
            <div className="rounded-lg p-3 text-sm w-3/4 bg-gray-100 text-gray-800">
              Typing...
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-4 flex items-center gap-2">
        <Input 
          type="text" 
          placeholder="Ask a question..." 
          value={message}
          onChange={e => setMessage(e.target.value)}
          onKeyDown={e => e.key === 'Enter' ? handleSendMessage() : null}
        />
        <Button onClick={handleSendMessage}><Send className="h-4 w-4" /></Button>
      </div>
    </div>
  );
}
