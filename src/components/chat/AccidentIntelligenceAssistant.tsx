
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { AlertTriangle, MessageSquare, Send, Car, Check } from 'lucide-react';
import { AccidentImpactCard } from '@/components/valuation/AccidentImpactCard';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const initialMessages: Message[] = [
  {
    id: '1',
    sender: 'assistant',
    content: 'Hi there! I\'m AIN, your Auto Intelligence assistant. How can I help you understand the impact of accidents on your vehicle\'s value?',
    timestamp: new Date()
  }
];

export function AccidentIntelligenceAssistant() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputMessage, setInputMessage] = useState('');
  const [showAccidentForm, setShowAccidentForm] = useState(false);
  const [accidentDetails, setAccidentDetails] = useState({
    count: 0,
    severity: 'minor' as 'minor' | 'moderate' | 'severe',
    description: ''
  });
  const [baseValue, setBaseValue] = useState(20000); // Default base value
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    // Add user message
    const newUserMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      content: inputMessage,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newUserMessage]);

    // Process message intent
    const lowerCaseMessage = inputMessage.toLowerCase();
    let response = '';
    
    // Detect accident-related questions
    if (
      lowerCaseMessage.includes('accident') || 
      lowerCaseMessage.includes('crash') || 
      lowerCaseMessage.includes('collision') || 
      lowerCaseMessage.includes('damage')
    ) {
      if (user) {
        response = "I'd be happy to analyze how an accident might affect your vehicle's value. Could you provide some details about the accident? Click below to enter information.";
        setShowAccidentForm(true);
      } else {
        response = "Accidents can significantly impact your vehicle's value, typically reducing it by 5-20% depending on severity. To get a personalized analysis, please sign in or create an account. Would you like to do that now?";
      }
    } 
    // Detect VIN or vehicle info requests
    else if (
      lowerCaseMessage.includes('vin') ||
      lowerCaseMessage.includes('vehicle') ||
      lowerCaseMessage.includes('car details')
    ) {
      response = "To provide an accurate valuation impact analysis, I'll need your vehicle information. Would you like to enter your VIN or vehicle details now?";
    }
    // Default response for other queries
    else {
      response = "I specialize in analyzing how accidents and damage affect vehicle values. Could you tell me more about your vehicle or any accident history you'd like to assess?";
    }

    // Add assistant response
    const newAssistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      sender: 'assistant',
      content: response,
      timestamp: new Date(Date.now() + 500) // Slight delay to seem more natural
    };
    
    setTimeout(() => {
      setMessages(prev => [...prev, newAssistantMessage]);
    }, 500);
    
    setInputMessage('');
  };

  const handleAccidentFormSubmit = () => {
    setShowAccidentForm(false);
    
    const formSummary = `Based on the information you provided (${accidentDetails.count} ${accidentDetails.severity} accident${accidentDetails.count !== 1 ? 's' : ''}), here's my analysis:`;
    
    const newAssistantMessage: Message = {
      id: Date.now().toString(),
      sender: 'assistant',
      content: formSummary,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newAssistantMessage]);
  };

  const handleUpgradeToPremium = () => {
    navigate('/premium');
  };

  return (
    <div className="flex flex-col h-full">
      <Card className="flex flex-col h-full">
        <CardHeader className="border-b">
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              AIN Accident Intelligence
            </CardTitle>
            {!user && (
              <Badge variant="outline" className="bg-primary/10">Sign in for premium insights</Badge>
            )}
          </div>
          <CardDescription>
            Ask about how accidents affect your vehicle's value
          </CardDescription>
        </CardHeader>
        
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map(message => (
            <div 
              key={message.id} 
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.sender === 'user' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
          
          {showAccidentForm && (
            <div className="bg-muted/50 p-4 rounded-lg border my-4">
              <h3 className="font-medium mb-4">Accident Details</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium block mb-1">How many accidents?</label>
                  <div className="flex space-x-2">
                    {[0, 1, 2, 3].map(num => (
                      <Button
                        key={num}
                        type="button"
                        variant={accidentDetails.count === num ? "default" : "outline"}
                        size="sm"
                        onClick={() => setAccidentDetails(prev => ({ ...prev, count: num }))}
                      >
                        {num}
                      </Button>
                    ))}
                  </div>
                </div>
                
                {accidentDetails.count > 0 && (
                  <>
                    <div>
                      <label className="text-sm font-medium block mb-1">Severity</label>
                      <div className="flex space-x-2">
                        {['minor', 'moderate', 'severe'].map((severity) => (
                          <Button
                            key={severity}
                            type="button"
                            variant={accidentDetails.severity === severity ? "default" : "outline"}
                            size="sm"
                            onClick={() => setAccidentDetails(prev => ({ 
                              ...prev, 
                              severity: severity as 'minor' | 'moderate' | 'severe' 
                            }))}
                          >
                            {severity.charAt(0).toUpperCase() + severity.slice(1)}
                          </Button>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium block mb-1">Brief description (optional)</label>
                      <Textarea
                        placeholder="E.g., Front-end collision, repaired at dealer..."
                        value={accidentDetails.description}
                        onChange={(e) => setAccidentDetails(prev => ({
                          ...prev,
                          description: e.target.value
                        }))}
                        rows={3}
                      />
                    </div>
                  </>
                )}
                
                <div className="pt-2 flex justify-end">
                  <Button onClick={handleAccidentFormSubmit}>
                    Analyze Impact
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          {accidentDetails.count !== undefined && !showAccidentForm && messages.length > 2 && (
            <AccidentImpactCard
              baseValue={baseValue}
              accidentCount={accidentDetails.count}
              accidentSeverity={accidentDetails.severity}
              accidentDescription={accidentDetails.description}
              onUpgradeToPremium={handleUpgradeToPremium}
            />
          )}
        </CardContent>
        
        <CardFooter className="border-t p-4">
          <div className="flex w-full gap-2">
            <Input
              placeholder="Ask about accident impact on value..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1"
            />
            <Button onClick={handleSendMessage}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
