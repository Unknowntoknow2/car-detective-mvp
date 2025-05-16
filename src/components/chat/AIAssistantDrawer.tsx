
import React, { useState, useEffect, useRef } from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChatMessage } from './ChatMessage';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BrainCircuit, Send, Loader2, Mail, Link as LinkIcon, UserRound, Building2 } from 'lucide-react';
import { askAI } from '@/api/askAI';
import { useValuationContext } from '@/hooks/useValuationContext';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface AIAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

// Interface for UI display
interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: string; // Keep as string for our UI
  isPremiumContent?: boolean;
  suggestedQuestions?: string[];
}

// Type for API communication - to match askAI.ts expectations
interface ApiMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: number; // API expects number
}

export const AIAssistantDrawer: React.FC<AIAssistantDrawerProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { vehicle, valuationId } = useValuationContext();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [isLinkLoading, setIsLinkLoading] = useState(false);
  
  // Initialize context for the assistant
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // System message to provide context to the assistant
      const systemMessage: Message = {
        role: 'system',
        content: `You are AIN — Auto Intelligence Network™, a GPT-4-powered vehicle valuation assistant built by Car Detective. 
Your job is to assist users with car valuations, market trends, dealer offers, and CARFAX insights.
${vehicle ? `Current vehicle context: ${vehicle.year} ${vehicle.make} ${vehicle.model} with ${vehicle.mileage} miles in condition: ${vehicle.exteriorColor || 'unknown color'}. User has ${valuationId ? 'completed' : 'not completed'} a valuation.` : 'No vehicle context available.'}
${user ? `User is logged in as ${user.email}.` : 'User is not logged in.'}
${valuationId ? `Current valuation ID: ${valuationId}` : 'No valuation ID available.'}
${valuationId && vehicle?.premium_unlocked ? 'User has premium access.' : 'User does not have premium access.'}
Always be helpful, friendly, and conversational.`,
        timestamp: new Date().toISOString(),
      };
      
      setMessages([systemMessage]);
      
      // Initial assistant greeting
      const welcomeMessage: Message = {
        role: 'assistant',
        content: `👋 Hi there! I'm AIN, your Auto Intelligence Network™ assistant.${vehicle ? `\n\nI see you're looking at a ${vehicle.year} ${vehicle.make} ${vehicle.model}${vehicle.mileage ? ' with ' + vehicle.mileage + ' miles' : ''}.` : ''}\n\nHow can I help you today?`,
        timestamp: new Date().toISOString(),
        suggestedQuestions: getInitialSuggestions(),
      };
      
      setMessages(prev => [...prev, welcomeMessage]);
    }
  }, [isOpen, vehicle, valuationId, user]);
  
  // Get initial suggestions based on context
  const getInitialSuggestions = () => {
    if (vehicle && valuationId) {
      return [
        "What's my car worth?",
        "How can I increase my car's value?",
        "Should I sell now or wait?"
      ];
    } else if (vehicle) {
      return [
        "How can I complete my valuation?",
        "What information do you need?",
        "How accurate are your valuations?"
      ];
    } else {
      return [
        "How do I get a car valuation?",
        "What's Car Detective?",
        "How accurate are your valuations?"
      ];
    }
  };

  // Generate smart follow-up questions based on context and previous messages
  const generateSmartFollowUps = (content: string) => {
    const lowerContent = content.toLowerCase();
    
    // Value-related questions
    if (lowerContent.includes('value') || lowerContent.includes('worth') || lowerContent.includes('price')) {
      return [
        "Want to see price trends in your ZIP?",
        "How does my car compare to similar models?",
        "What factors affect my car's value the most?"
      ];
    }
    
    // Accident or CARFAX related questions
    if (lowerContent.includes('accident') || lowerContent.includes('carfax') || lowerContent.includes('damage')) {
      return [
        "Need help interpreting your CARFAX?",
        "How do accidents impact my car's value?",
        "What should I disclose to potential buyers?"
      ];
    }
    
    // Next steps questions
    if (lowerContent.includes('what next') || lowerContent.includes('what should i do') || lowerContent.includes('next step')) {
      return [
        "Compare dealer offers now",
        "How can I prepare my car for sale?",
        "What documents do I need when selling?"
      ];
    }
    
    // Premium or upgrade related
    if (lowerContent.includes('premium') || lowerContent.includes('upgrade') || lowerContent.includes('paid')) {
      return [
        "What's included in Premium?",
        "How much does Premium cost?",
        "Is Premium worth it for me?"
      ];
    }
    
    // Default follow-ups
    return [
      "Tell me more about my car's market value",
      "How can I get the best offer?",
      "What services does Car Detective offer?"
    ];
  };
  
  // Prepare valuation context for the AI
  const valuationContext = {
    user: user ? { email: user.email } : null,
    valuation: vehicle ? {
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year,
      mileage: vehicle.mileage,
      condition: vehicle.condition,
      premium: vehicle.premium_unlocked,
    } : null,
    valuationId
  };
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  // Handle sending message to the assistant
  const handleSendMessage = async () => {
    if (!messageInput.trim() || isLoading) return;
    
    // Handle special commands
    if (shouldHandleEmailReport(messageInput)) {
      await handleEmailReport();
      return;
    }
    
    if (shouldHandleShareableLink(messageInput)) {
      await handleShareableLink();
      return;
    }
    
    if (shouldHandleContact(messageInput)) {
      handleContactOptions();
      return;
    }
    
    // Regular message flow
    const userMessage: Message = {
      role: 'user',
      content: messageInput,
      timestamp: new Date().toISOString(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setMessageInput('');
    setIsLoading(true);
    
    try {
      // Convert UI messages to API format
      const apiMessages = messages
        .filter(m => m.role !== 'system')
        .map(m => ({
          role: m.role,
          content: m.content,
          timestamp: m.timestamp ? new Date(m.timestamp).getTime() : undefined
        })) as ApiMessage[];
      
      const response = await askAI({
        question: messageInput,
        userContext: valuationContext,
        chatHistory: apiMessages,
      });
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      // Detect if response contains premium content references
      const isPremiumContent = detectPremiumContent(response.answer || '');
      
      // Generate smart follow-up questions
      const suggestedQuestions = generateSmartFollowUps(response.answer || '');
      
      const assistantMessage: Message = {
        role: 'assistant',
        content: response.answer || "I'm sorry, I couldn't generate a response. Please try again.",
        timestamp: new Date().toISOString(),
        isPremiumContent,
        suggestedQuestions
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      
      const errorMessage: Message = {
        role: 'assistant',
        content: "I'm sorry, I encountered an error while processing your request. Please try again later.",
        timestamp: new Date().toISOString(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Detect premium content in the response
  const detectPremiumContent = (text: string): boolean => {
    const premiumKeywords = [
      'carfax',
      'vehicle history',
      'accident history',
      'service records',
      'detailed history',
      'title status',
      'premium feature',
      'premium users',
      'premium report',
      'premium access'
    ];
    
    const lowerText = text.toLowerCase();
    return premiumKeywords.some(keyword => lowerText.includes(keyword));
  };
  
  // Check if message is about emailing report
  const shouldHandleEmailReport = (message: string): boolean => {
    const lowerMessage = message.toLowerCase();
    return (
      (lowerMessage.includes('email') || 
       lowerMessage.includes('send') || 
       lowerMessage.includes('report')) && 
      (lowerMessage.includes('report') || 
       lowerMessage.includes('valuation') || 
       lowerMessage.includes('result'))
    );
  };
  
  // Check if message is about sharing link
  const shouldHandleShareableLink = (message: string): boolean => {
    const lowerMessage = message.toLowerCase();
    return (
      (lowerMessage.includes('share') || 
       lowerMessage.includes('link') || 
       lowerMessage.includes('copy') || 
       lowerMessage.includes('show someone')) && 
      (lowerMessage.includes('valuation') || 
       lowerMessage.includes('report') || 
       lowerMessage.includes('result'))
    );
  };
  
  // Check if message is about contacting someone
  const shouldHandleContact = (message: string): boolean => {
    const lowerMessage = message.toLowerCase();
    return (
      lowerMessage.includes('speak with someone') || 
      lowerMessage.includes('real person') || 
      lowerMessage.includes('help from a dealer') || 
      lowerMessage.includes('contact support') || 
      lowerMessage.includes('talk to someone') || 
      lowerMessage.includes('human') || 
      lowerMessage.includes('agent')
    );
  };
  
  // Handle emailing valuation report
  const handleEmailReport = async () => {
    if (!user || !valuationId) {
      const message: Message = {
        role: 'assistant',
        content: user 
          ? "I need a completed valuation to email you a report. Would you like to start a valuation now?" 
          : "You'll need to log in and complete a valuation before I can email you a report. Would you like to sign in now?",
        timestamp: new Date().toISOString(),
        suggestedQuestions: user 
          ? ["Start a valuation", "How does valuation work?"] 
          : ["Sign in", "Create an account"]
      };
      
      setMessages(prev => [...prev, {
        role: 'user',
        content: messageInput,
        timestamp: new Date().toISOString(),
      }, message]);
      
      setMessageInput('');
      return;
    }
    
    setMessages(prev => [...prev, {
      role: 'user',
      content: messageInput,
      timestamp: new Date().toISOString(),
    }]);
    
    setMessageInput('');
    setIsEmailLoading(true);
    
    try {
      // Call the email valuation PDF edge function
      const { data, error } = await supabase.functions.invoke('email-valuation-pdf', {
        body: { 
          valuationId, 
          email: user.email,
          userName: localStorage.getItem('userName') || undefined
        }
      });
      
      if (error) throw new Error(error.message);
      
      const successMessage: Message = {
        role: 'assistant',
        content: `📤 Great! I've sent the valuation report to ${user.email}. It should arrive in your inbox shortly. Is there anything else you'd like to know about your vehicle?`,
        timestamp: new Date().toISOString(),
        suggestedQuestions: [
          "What else can I do with my valuation?",
          "How accurate is this report?",
          "Show me dealer offers"
        ]
      };
      
      setMessages(prev => [...prev, successMessage]);
      toast.success("Valuation report sent to your email");
    } catch (error) {
      console.error('Error sending email report:', error);
      
      const errorMessage: Message = {
        role: 'assistant',
        content: "I'm sorry, I encountered an error while trying to email your report. Please try again later or contact our support team for assistance.",
        timestamp: new Date().toISOString(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
      toast.error("Failed to send valuation report");
    } finally {
      setIsEmailLoading(false);
    }
  };
  
  // Handle generating shareable link
  const handleShareableLink = async () => {
    if (!user || !valuationId) {
      const message: Message = {
        role: 'assistant',
        content: user 
          ? "I need a completed valuation to generate a shareable link. Would you like to start a valuation now?" 
          : "You'll need to log in and complete a valuation before I can create a shareable link. Would you like to sign in now?",
        timestamp: new Date().toISOString(),
        suggestedQuestions: user 
          ? ["Start a valuation", "How does valuation work?"] 
          : ["Sign in", "Create an account"]
      };
      
      setMessages(prev => [...prev, {
        role: 'user',
        content: messageInput,
        timestamp: new Date().toISOString(),
      }, message]);
      
      setMessageInput('');
      return;
    }
    
    setMessages(prev => [...prev, {
      role: 'user',
      content: messageInput,
      timestamp: new Date().toISOString(),
    }]);
    
    setMessageInput('');
    setIsLinkLoading(true);
    
    try {
      // Call the create public token edge function
      const { data, error } = await supabase.functions.invoke('create-public-token', {
        body: { valuationId }
      });
      
      if (error) throw new Error(error.message);
      
      // Create the full shareable URL
      const shareUrl = `${window.location.origin}${data.shareUrl}`;
      
      // Copy to clipboard
      await navigator.clipboard.writeText(shareUrl);
      
      const successMessage: Message = {
        role: 'assistant',
        content: `🔗 Perfect! I've created a shareable link for your valuation and copied it to your clipboard:\n\n\`${shareUrl}\`\n\nYou can share this with anyone, and they'll be able to view your valuation details. The link will expire after 30 days. Is there anything else you'd like to do?`,
        timestamp: new Date().toISOString(),
        suggestedQuestions: [
          "Email me the report too",
          "How do I update this valuation?",
          "Can dealers see this?"
        ]
      };
      
      setMessages(prev => [...prev, successMessage]);
      toast.success("Shareable link copied to clipboard");
    } catch (error) {
      console.error('Error generating shareable link:', error);
      
      const errorMessage: Message = {
        role: 'assistant',
        content: "I'm sorry, I encountered an error while trying to generate a shareable link. Please try again later or contact our support team for assistance.",
        timestamp: new Date().toISOString(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
      toast.error("Failed to generate shareable link");
    } finally {
      setIsLinkLoading(false);
    }
  };
  
  // Handle contact options
  const handleContactOptions = () => {
    const userMessage: Message = {
      role: 'user',
      content: messageInput,
      timestamp: new Date().toISOString(),
    };
    
    const assistantMessage: Message = {
      role: 'assistant',
      content: "I can connect you to a support agent or a verified local dealer. Who would you like to talk to?",
      timestamp: new Date().toISOString(),
    };
    
    setMessages(prev => [...prev, userMessage, assistantMessage]);
    setMessageInput('');
    
    // Add contact option buttons after a short delay
    setTimeout(() => {
      const contactOptionsMessage: Message = {
        role: 'assistant',
        content: "Please select one of the options below:",
        timestamp: new Date().toISOString(),
        suggestedQuestions: [
          "🧑‍💼 Contact Support",
          "🚗 Contact Dealer"
        ]
      };
      
      setMessages(prev => [...prev, contactOptionsMessage]);
    }, 500);
  };
  
  // Handle suggested question click
  const handleSuggestedQuestionClick = (question: string) => {
    // For contact options
    if (question === "🧑‍💼 Contact Support") {
      handleContactSupport();
      return;
    }
    
    if (question === "🚗 Contact Dealer") {
      handleContactDealer();
      return;
    }
    
    // For regular suggested questions
    setMessageInput(question);
    
    // Small delay before sending to make it feel more natural
    setTimeout(() => {
      handleSendMessage();
    }, 100);
  };
  
  // Handle contact support
  const handleContactSupport = () => {
    const userMessage: Message = {
      role: 'user',
      content: "🧑‍💼 Contact Support",
      timestamp: new Date().toISOString(),
    };
    
    const assistantMessage: Message = {
      role: 'assistant',
      content: "I'll connect you with our support team. They can be reached at support@cardetective.com. Would you like me to send them an email on your behalf now?",
      timestamp: new Date().toISOString(),
      suggestedQuestions: [
        "Yes, email support for me",
        "I'll email them myself",
        "Go back to car valuation"
      ]
    };
    
    setMessages(prev => [...prev, userMessage, assistantMessage]);
  };
  
  // Handle contact dealer
  const handleContactDealer = () => {
    const userMessage: Message = {
      role: 'user',
      content: "🚗 Contact Dealer",
      timestamp: new Date().toISOString(),
    };
    
    const assistantMessage: Message = {
      role: 'assistant',
      content: `I can help you get in touch with verified local dealers who may be interested in your ${vehicle ? `${vehicle.year} ${vehicle.make} ${vehicle.model}` : 'vehicle'}. Would you like to:`,
      timestamp: new Date().toISOString(),
      suggestedQuestions: [
        "Submit my info to dealers",
        "See dealer offers first",
        "Go back to car valuation"
      ]
    };
    
    setMessages(prev => [...prev, userMessage, assistantMessage]);
  };

  return (
    <Drawer open={isOpen} onOpenChange={onClose} direction="right">
      <DrawerContent className="h-full max-w-md">
        <DrawerHeader className="border-b">
          <DrawerTitle className="flex items-center">
            <BrainCircuit className="mr-2 h-5 w-5 text-primary" />
            <span>AIN — Auto Intelligence Network™</span>
          </DrawerTitle>
        </DrawerHeader>
        
        {/* Vehicle context if available */}
        {vehicle && (
          <div className="px-4 py-2 bg-muted/50 border-b text-xs text-muted-foreground">
            <p className="flex items-center gap-1">
              📌 {vehicle.year} {vehicle.make} {vehicle.model} • 
              {vehicle.mileage && ` ${vehicle.mileage.toLocaleString()} miles • `}
              {vehicle.zipCode && ` ZIP ${vehicle.zipCode} • `}
              Premium: {vehicle.premium_unlocked ? '✅' : '❌'}
            </p>
          </div>
        )}
        
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.filter(m => m.role !== 'system').map((message, index) => (
              <ChatMessage 
                key={index} 
                role={message.role} 
                content={message.content} 
                timestamp={message.timestamp}
                isPremiumContent={message.isPremiumContent}
                suggestedQuestions={message.suggestedQuestions}
                onSuggestedQuestionClick={handleSuggestedQuestionClick}
              />
            ))}
            
            {isLoading && (
              <div className="flex items-center space-x-2 text-muted-foreground text-sm pl-10">
                <Loader2 className="h-3 w-3 animate-spin" />
                <span>AIN is thinking...</span>
              </div>
            )}
            
            {(isEmailLoading || isLinkLoading) && (
              <div className="flex items-center space-x-2 text-muted-foreground text-sm pl-10">
                <Loader2 className="h-3 w-3 animate-spin" />
                <span>{isEmailLoading ? 'Sending email report...' : 'Generating shareable link...'}</span>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
        
        <DrawerFooter className="border-t pt-2">
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Ask AIN anything about your car..."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              disabled={isLoading || isEmailLoading || isLinkLoading}
              className="flex-1"
            />
            <Button 
              size="icon" 
              onClick={handleSendMessage}
              disabled={!messageInput.trim() || isLoading || isEmailLoading || isLinkLoading}
            >
              {isLoading || isEmailLoading || isLinkLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
          
          <div className="flex justify-between pt-2">
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1 text-xs"
                onClick={() => setMessageInput("Share my valuation report")}
              >
                <Mail className="h-3 w-3" />
                Email
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1 text-xs"
                onClick={() => setMessageInput("Generate shareable link")}
              >
                <LinkIcon className="h-3 w-3" />
                Share
              </Button>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1 text-xs"
                onClick={() => setMessageInput("Can I speak with someone?")}
              >
                <UserRound className="h-3 w-3" />
                Support
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1 text-xs"
                onClick={() => setMessageInput("I'd like to contact a dealer")}
              >
                <Building2 className="h-3 w-3" />
                Dealer
              </Button>
            </div>
          </div>
          
          <p className="text-center text-xs text-muted-foreground pt-2">
            AIN is an AI assistant and may provide incorrect information.
          </p>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
