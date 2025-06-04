import React, { useEffect, useRef, useState } from "react";
import { Loader2, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { ChatMessage } from "./ChatMessage";
import { supabase } from "@/integrations/supabase/client";
import { useValuationContext } from "@/hooks/useValuationContext";
import { getValuationContext } from "@/utils/getValuationContext";
import { toast } from "sonner";

// Define types for our messages
interface Message {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
  isPremiumContent?: boolean;
  suggestedQuestions?: string[];
}

// Define an interface specifically for API messages with number timestamp
interface ApiMessage {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: number;
}

export interface AIAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AIAssistantDrawer: React.FC<AIAssistantDrawerProps> = (
  { isOpen, onClose },
) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { vehicle, valuationId } = useValuationContext();
  const [valuationContext, setValuationContext] = useState<any>(null);

  // Fetch valuation context if available
  useEffect(() => {
    const fetchValuationData = async () => {
      if (valuationId) {
        const data = await getValuationContext(valuationId);
        setValuationContext(data);
      }
    };

    fetchValuationData();
  }, [valuationId]);

  // Determine if premium is unlocked based on valuation context
  const isPremiumUnlocked = valuationContext?.premium_unlocked || false;

  useEffect(() => {
    // Initialize with a welcome message when first opened
    if (isOpen && messages.length === 0) {
      let welcomeMessage =
        "👋 Hi there! I'm Car Detective's AI Assistant. I can help you with vehicle valuations, market insights, and more.";

      // If we have vehicle context, provide a more personalized welcome
      if (vehicle) {
        welcomeMessage =
          `👋 Hi there! I'm Car Detective's AI Assistant. I see you're looking at a ${vehicle.year} ${vehicle.make} ${vehicle.model}. How can I help you with this vehicle?`;
      }

      setMessages([
        {
          role: "assistant",
          content: welcomeMessage,
          timestamp: new Date().toISOString(),
          suggestedQuestions: [
            "How accurate is this valuation?",
            "What affects my car's value?",
            "How can I improve my car's value?",
          ],
        },
      ]);
    }
  }, [isOpen, messages.length, vehicle]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }

    // Focus input when drawer opens
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [messages, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSuggestedQuestionClick = (question: string) => {
    setInputValue(question);
    handleSendMessage(question);
  };

  const processApiMessage = (content: string): string => {
    // This function processes the message content to handle any API-specific formatting
    return content;
  };

  const getSuggestedFollowups = (
    question: string,
    content: string,
  ): string[] => {
    const lowerQuestion = question.toLowerCase();
    const lowerContent = content.toLowerCase();

    // Valuation-related questions
    if (
      lowerQuestion.includes("value") || lowerQuestion.includes("worth") ||
      lowerContent.includes("valuation")
    ) {
      return [
        "Want to see price trends in your ZIP?",
        "How can I improve my car's value?",
        "How does mileage affect value?",
      ];
    }

    // Accident-related questions
    if (
      lowerQuestion.includes("accident") || lowerQuestion.includes("damage") ||
      lowerContent.includes("carfax")
    ) {
      return [
        "Need help interpreting your CARFAX?",
        "How do accidents affect resale value?",
        "What repairs improve value most?",
      ];
    }

    // Next steps queries
    if (
      lowerQuestion.includes("what next") ||
      lowerQuestion.includes("next step") || lowerQuestion.includes("now what")
    ) {
      return [
        "Compare dealer offers now",
        "Download your valuation report",
        "Share this valuation with someone",
      ];
    }

    // If nothing specific, return general follow-ups
    return [
      "Tell me more about car values",
      "What factors affect my car's value?",
      "How does Car Detective work?",
    ];
  };

  const detectActionRequests = (message: string): boolean => {
    const lowerMessage = message.toLowerCase();

    // Share/send detection
    if (
      lowerMessage.includes("share") ||
      lowerMessage.includes("send") ||
      lowerMessage.includes("email") ||
      lowerMessage.includes("show someone")
    ) {
      if (valuationId) {
        const shareResponse = `I can help you share your valuation results:
        
- 📤 **Send report to email**: I'll send the full PDF report to your email
- 🔗 **Get shareable link**: I'll generate a link you can share with anyone
        
What would you like to do?`;

        setMessages((prev) => [...prev, {
          role: "assistant",
          content: shareResponse,
          timestamp: new Date().toISOString(),
          suggestedQuestions: [
            "Send report to my email",
            "Get shareable link",
            "I need something else",
          ],
        }]);

        return true;
      }
    }

    // Contact request detection
    if (
      lowerMessage.includes("speak with someone") ||
      lowerMessage.includes("real person") ||
      lowerMessage.includes("talk to someone") ||
      lowerMessage.includes("need help") ||
      lowerMessage.includes("dealer")
    ) {
      const contactResponse =
        `I can connect you to a support agent or a verified local dealer. Who would you like to talk to?`;

      setMessages((prev) => [...prev, {
        role: "assistant",
        content: contactResponse,
        timestamp: new Date().toISOString(),
        suggestedQuestions: [
          "🧑‍💼 Contact Support",
          "🚗 Contact Dealer",
          "I'll continue with AI",
        ],
      }]);

      return true;
    }

    // If vehicle context is available and user asks for vehicle condition
    if (
      valuationContext &&
      (lowerMessage.includes("condition") ||
        lowerMessage.includes("how good") || lowerMessage.includes("shape"))
    ) {
      const conditionInfo = valuationContext.condition || "Unknown";
      const isPremium = valuationContext.premium_unlocked || false;

      let conditionResponse =
        `Based on the information provided, your vehicle's condition is rated as **${conditionInfo}**.`;

      if (!isPremium) {
        conditionResponse +=
          `\n\n🔒 For a detailed condition analysis with specific observations, upgrade to Premium.`;
      }

      setMessages((prev) => [...prev, {
        role: "assistant",
        content: conditionResponse,
        timestamp: new Date().toISOString(),
        isPremiumContent: !isPremium,
        suggestedQuestions: !isPremium
          ? [
            "Upgrade to Premium",
            "What affects condition?",
            "How can I improve condition?",
          ]
          : [
            "What affects condition?",
            "How can I improve condition?",
            "How does condition affect value?",
          ],
      }]);

      return true;
    }

    return false;
  };

  const handleSpecialActions = async (message: string): Promise<boolean> => {
    const lowerMessage = message.toLowerCase();

    // Handle email report request
    if (
      lowerMessage.includes("send report") || lowerMessage.includes("email")
    ) {
      if (valuationId) {
        setIsLoading(true);

        try {
          // Call the email-valuation-pdf edge function
          const { error } = await supabase.functions.invoke(
            "email-valuation-pdf",
            {
              body: { valuationId },
            },
          );

          if (error) throw error;

          setMessages((prev) => [...prev, {
            role: "assistant",
            content:
              "✅ Great! I've sent the valuation report to your email. It should arrive shortly. Let me know if you need anything else!",
            timestamp: new Date().toISOString(),
            suggestedQuestions: [
              "I need dealer quotes",
              "How can I improve my car's value?",
              "What affects car value most?",
            ],
          }]);

          toast.success("Report sent to your email!");
        } catch (error) {
          console.error("Error sending email:", error);

          setMessages((prev) => [...prev, {
            role: "assistant",
            content:
              "Sorry, I wasn't able to send the email. Please try again later or contact support if the problem persists.",
            timestamp: new Date().toISOString(),
          }]);

          toast.error("Failed to send email");
        }

        setIsLoading(false);
        return true;
      }
    }

    // Handle share link request
    if (
      lowerMessage.includes("shareable link") ||
      lowerMessage.includes("get link")
    ) {
      if (valuationId) {
        setIsLoading(true);

        try {
          // Call the create-public-token edge function
          const { data, error } = await supabase.functions.invoke(
            "create-public-token",
            {
              body: { valuationId },
            },
          );

          if (error) throw error;

          const shareableLink = `${globalThis.location.origin}/share/${data.token}`;

          navigator.clipboard.writeText(shareableLink);

          setMessages((prev) => [...prev, {
            role: "assistant",
            content:
              `✅ I've generated a shareable link and copied it to your clipboard:\n\n**${shareableLink}**\n\nThis link will let anyone view your valuation results without needing to sign in.`,
            timestamp: new Date().toISOString(),
            suggestedQuestions: [
              "How long is this link valid?",
              "Can I revoke access?",
              "Thanks, that's all I needed",
            ],
          }]);

          toast.success("Link copied to clipboard!");
        } catch (error) {
          console.error("Error creating share link:", error);

          setMessages((prev) => [...prev, {
            role: "assistant",
            content:
              "Sorry, I wasn't able to create a shareable link. Please try again later or contact support if the problem persists.",
            timestamp: new Date().toISOString(),
          }]);

          toast.error("Failed to create link");
        }

        setIsLoading(false);
        return true;
      }
    }

    // Handle contact support
    if (lowerMessage.includes("contact support")) {
      globalThis.location.href =
        "mailto:support@cardetective.com?subject=Support%20Request";

      setMessages((prev) => [...prev, {
        role: "assistant",
        content:
          "I've opened your email client to contact our support team at support@cardetective.com. If it didn't open automatically, please send them an email directly.",
        timestamp: new Date().toISOString(),
      }]);

      return true;
    }

    // Handle contact dealer
    if (lowerMessage.includes("contact dealer")) {
      if (valuationId) {
        // Redirect to dealer leads form
        globalThis.location.href = `/dealer-leads?valuationId=${valuationId}`;

        setMessages((prev) => [...prev, {
          role: "assistant",
          content:
            "I'm connecting you with verified dealers in your area who can provide offers on your vehicle.",
          timestamp: new Date().toISOString(),
        }]);
      } else {
        setMessages((prev) => [...prev, {
          role: "assistant",
          content:
            "To connect you with dealers, I'll need a vehicle valuation first. Would you like to start a valuation now?",
          timestamp: new Date().toISOString(),
          suggestedQuestions: [
            "Start a valuation",
            "I already have a valuation",
            "No thanks",
          ],
        }]);
      }

      return true;
    }

    return false;
  };

  const handleSendMessage = async (messageText: string = inputValue) => {
    if (!messageText.trim()) return;

    // Add user message to chat
    const userMessage: Message = {
      role: "user",
      content: messageText,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setMessageCount((prev) => prev + 1);

    // Check for action requests first (share, contact, etc.)
    if (await handleSpecialActions(messageText)) {
      return;
    }

    // Check for other types of action requests
    if (detectActionRequests(messageText)) {
      return;
    }

    // If no special actions, proceed with AI response
    setIsLoading(true);

    // Build context for the AI
    let context =
      "You are Car Detective's AI assistant. You help users understand vehicle valuations and market trends.";

    // Add vehicle context if available
    if (valuationContext) {
      context +=
        ` The user is currently looking at a ${valuationContext.year} ${valuationContext.make} ${valuationContext.model} with ${valuationContext.mileage} miles, in ${valuationContext.condition} condition, with an estimated value of $${valuationContext.estimatedValue}.`;

      if (valuationContext.zipCode) {
        context += ` The location is in ZIP code ${valuationContext.zipCode}.`;
      }

      if (!valuationContext.premium_unlocked) {
        context +=
          " The user does not have premium access, so mention premium-only insights as locked features.";
      }
    }

    try {
      // Convert messages to API format (number timestamps)
      const apiMessages: ApiMessage[] = messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
        timestamp: new Date(msg.timestamp).getTime(),
      }));

      // Add current user message
      apiMessages.push({
        role: "user",
        content: messageText,
        timestamp: Date.now(),
      });

      // This would normally call an API, but for this example, we'll simulate a response
      // In a real implementation, you would call your AI backend
      setTimeout(() => {
        // Process the response
        const responseContent = processApiMessage(
          `I'm happy to help with your query about "${messageText}". This is a simulated AI response. In a real implementation, this would connect to your backend AI service.`,
        );

        // Generate suggested follow-up questions based on the user's query and the response
        const suggestedQuestions = getSuggestedFollowups(
          messageText,
          responseContent,
        );

        const aiResponse: Message = {
          role: "assistant",
          content: responseContent,
          timestamp: new Date().toISOString(),
          suggestedQuestions,
        };

        setMessages((prev) => [...prev, aiResponse]);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error in AI response:", error);

      // Add error message
      setMessages((prev) => [...prev, {
        role: "assistant",
        content:
          "I'm sorry, I encountered an error processing your request. Please try again later.",
        timestamp: new Date().toISOString(),
      }]);

      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent className="h-[80vh] sm:h-[85vh] max-w-md sm:max-w-lg md:max-w-xl mx-auto rounded-t-lg">
        <DrawerHeader className="border-b">
          <DrawerTitle className="text-center text-lg">
            Car Detective AI Assistant
          </DrawerTitle>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-3"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </DrawerHeader>

        <ScrollArea className="p-4 h-[calc(80vh-10rem)] sm:h-[calc(85vh-10rem)]">
          <div className="flex flex-col space-y-4 mb-4">
            {messages.map((message, index) => (
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
              <div className="flex items-center justify-center py-2">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                <span className="ml-2 text-sm text-muted-foreground">
                  AI is thinking...
                </span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <DrawerFooter className="border-t pt-4">
          <div className="flex items-center space-x-2">
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              size="icon"
              onClick={() => handleSendMessage()}
              disabled={!inputValue.trim() || isLoading}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground mt-2">
            Car Detective AI provides general information and is not a
            substitute for professional advice.
          </p>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
