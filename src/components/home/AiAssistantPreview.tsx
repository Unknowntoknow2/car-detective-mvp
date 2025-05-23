
import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { 
  VehicleContext,
  AssistantContext
} from '@/types/assistant';
import { 
  extractVehicleContext, 
  extractLocationContext,
  detectIntent, 
  generateResponse 
} from '@/lib/valuation/extractVehicleContext';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function AiAssistantPreview() {
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [context, setContext] = useState<AssistantContext>({
    isPremium: false,
    hasDealerAccess: false,
    userLocation: { 
      region: 'California'
    }
  });
  const [vehicleContext, setVehicleContext] = useState<VehicleContext>({});
  
  // Update context when conversation changes
  useEffect(() => {
    if (conversation.length > 0) {
      const extractedVehicle = extractVehicleContext(conversation);
      const locationInfo = extractLocationContext(conversation);
      
      setVehicleContext(prev => ({
        ...prev,
        ...extractedVehicle
      }));
      
      if (locationInfo.region || locationInfo.zipCode) {
        setContext(prev => ({
          ...prev,
          userLocation: {
            ...prev.userLocation,
            ...locationInfo
          }
        }));
      }
    }
  }, [conversation]);
  
  const handleSendMessage = async () => {
    if (!message.trim()) return;
    
    // Add user message
    const userMsg = message.trim();
    setConversation(prev => [...prev, {role: 'user', content: userMsg}]);
    setMessage('');
    
    // Detect intent
    const intent = detectIntent(userMsg);
    
    // Update previous intents
    setContext(prev => ({
      ...prev,
      previousIntents: [...(prev.previousIntents || []), intent]
    }));
    
    // Simulate AI typing response
    setIsTyping(true);
    
    // Generate response based on intent and context
    const assistantContext = {
      ...context,
      vehicle: vehicleContext
    };
    
    try {
      const response = await generateResponse(intent, assistantContext, userMsg);
      
      setTimeout(() => {
        setIsTyping(false);
        setConversation(prev => [...prev, {role: 'assistant', content: response}]);
      }, 800 + Math.random() * 1200); // Realistic typing delay
    } catch (error) {
      console.error("Error generating response:", error);
      setIsTyping(false);
      setConversation(prev => [...prev, {
        role: 'assistant', 
        content: "I apologize, but I'm having trouble processing that request. Could you try again or rephrase your question?"
      }]);
    }
  };
  
  return (
    <div className="bg-gray-50 rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold mb-4">AI Assistant Preview</h2>
      
      <div className="space-y-4 max-h-[300px] overflow-y-auto mb-4">
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
              <div className="flex space-x-1">
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse"></div>
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse delay-150"></div>
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse delay-300"></div>
              </div>
            </div>
          </div>
        )}
        
        {conversation.length === 0 && !isTyping && (
          <div className="text-center py-8 text-muted-foreground">
            <p>Ask me about your vehicle's value, accident impact, best time to sell, or other car-related questions.</p>
          </div>
        )}
      </div>
      
      <div className="mt-4 flex items-center gap-2">
        <Input 
          type="text" 
          placeholder="Ask a question about your vehicle..." 
          value={message}
          onChange={e => setMessage(e.target.value)}
          onKeyDown={e => e.key === 'Enter' ? handleSendMessage() : null}
        />
        <Button onClick={handleSendMessage}><Send className="h-4 w-4" /></Button>
      </div>
      
      {/* Debug panel - remove in production */}
      {false && (
        <div className="mt-4 p-2 border rounded text-xs bg-gray-50">
          <p>Debug - Current Context:</p>
          <pre>{JSON.stringify(context, null, 2)}</pre>
          <p>Vehicle Context:</p>
          <pre>{JSON.stringify(vehicleContext, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
