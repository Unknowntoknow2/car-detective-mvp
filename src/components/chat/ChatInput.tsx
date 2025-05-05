
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { SendIcon, Loader2, Mic, MicOff } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
  placeholder?: string;
  disabled?: boolean;
}

export function ChatInput({ onSend, isLoading, placeholder = "Type a message...", disabled = false }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = message.trim();
    if (trimmed && !isLoading) {
      onSend(trimmed);
      setMessage('');
    }
  };

  // Auto resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = 'auto';
    const newHeight = Math.min(textarea.scrollHeight, 120); // Max height of 120px
    textarea.style.height = `${newHeight}px`;
  }, [message]);

  // Handle Shift+Enter for newline, Enter for submit
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Speech recognition functionality (simplified)
  const toggleSpeechRecognition = () => {
    // Check if browser supports speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      // In a real implementation, you would initialize the speech recognition API here
      setIsRecording(!isRecording);
      
      if (!isRecording) {
        // Start recording
        toast.info("Voice input is not fully implemented in this demo");
        // After a moment, simulate receiving voice input
        setTimeout(() => {
          setMessage(prev => prev + " How can I get a better valuation for my car?");
          setIsRecording(false);
        }, 2000);
      } else {
        // Stop recording
        setIsRecording(false);
      }
    } else {
      toast.error("Your browser doesn't support speech recognition");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-2 p-2 border-t w-full">
      <Textarea
        ref={textareaRef}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled || isLoading}
        className="min-h-[40px] max-h-[120px] resize-none bg-background py-2 flex-grow"
        rows={1}
      />
      <div className="flex gap-1">
        <Button 
          type="button"
          size="icon"
          variant="ghost"
          disabled={disabled}
          className="h-10 w-10 shrink-0 text-muted-foreground"
          onClick={toggleSpeechRecognition}
        >
          {isRecording ? (
            <MicOff className="h-5 w-5 text-red-500" />
          ) : (
            <Mic className="h-5 w-5" />
          )}
        </Button>
        <Button 
          type="submit" 
          size="icon" 
          disabled={!message.trim() || isLoading || disabled}
          className="h-10 w-10 shrink-0"
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <SendIcon className="h-5 w-5" />
          )}
        </Button>
      </div>
    </form>
  );
}

// Placeholder for toast functionality
// In a real implementation, you would import toast from your UI library
const toast = {
  info: (message: string) => console.log(`INFO: ${message}`),
  error: (message: string) => console.error(`ERROR: ${message}`)
};
