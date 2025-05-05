
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { SendIcon, Loader2, Mic, MicOff, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
  placeholder?: string;
  disabled?: boolean;
  onRegenerateResponse?: () => void;
  showRegenerate?: boolean;
}

export function ChatInput({ 
  onSend, 
  isLoading, 
  placeholder = "Type a message...", 
  disabled = false,
  onRegenerateResponse,
  showRegenerate = false
}: ChatInputProps) {
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

  // Speech recognition functionality
  const toggleSpeechRecognition = () => {
    // Check if browser supports speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setIsRecording(!isRecording);
      
      if (!isRecording) {
        // Start recording
        toast.info("Voice input started - speak clearly");
        // After a moment, simulate receiving voice input
        setTimeout(() => {
          setMessage(prev => prev + " How can I get a better valuation for my car?");
          setIsRecording(false);
          toast.success("Voice input captured");
        }, 2000);
      } else {
        // Stop recording
        setIsRecording(false);
        toast.info("Voice recording stopped");
      }
    } else {
      toast.error("Your browser doesn't support speech recognition");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 p-2 border-t w-full">
      {showRegenerate && onRegenerateResponse && (
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="self-center mb-1"
          onClick={onRegenerateResponse}
          disabled={isLoading}
        >
          <RefreshCw className="h-3 w-3 mr-2" />
          Regenerate response
        </Button>
      )}
      
      <div className="flex items-end gap-2">
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
            disabled={disabled || isLoading}
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
      </div>
    </form>
  );
}
