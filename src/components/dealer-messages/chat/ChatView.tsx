import React, { useEffect, useRef, useState } from 'react';
import { useLeads } from '../context/LeadsContext';
import { Message } from '../types';
import { formatDistanceToNow, format } from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';
import { Paperclip, Send, Smile, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import EmojiPicker from 'emoji-picker-react';
import { toast } from 'sonner';

export const ChatView: React.FC = () => {
  const { selectedLeadId, messages, sendMessage, isTyping } = useLeads();
  const [newMessage, setNewMessage] = useState('');
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [attachments, setAttachments] = useState<File[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    
    return () => clearTimeout(timer);
  }, [selectedLeadId]);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, selectedLeadId, isTyping]);

  const handleSendMessage = async () => {
    if (!selectedLeadId || (!newMessage.trim() && attachments.length === 0)) return;
    
    try {
      setIsSending(true);
      await sendMessage(selectedLeadId, newMessage, attachments);
      setNewMessage('');
      setAttachments([]);
    } catch (error) {
      toast.error('Failed to send message');
      console.error(error);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setAttachments(prev => [...prev, ...newFiles]);
    }
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleEmojiClick = (emojiData: { emoji: string }) => {
    setNewMessage(prev => prev + emojiData.emoji);
    setIsEmojiPickerOpen(false);
  };

  if (!selectedLeadId) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <h2 className="text-xl font-semibold mb-2">No conversation selected</h2>
          <p className="text-gray-500">Choose a lead from the sidebar to view messages</p>
        </div>
      </div>
    );
  }

  const currentMessages = messages[selectedLeadId] || [];
  
  // Group messages by date
  const groupMessagesByDate = (messages: Message[]) => {
    const groups: { [key: string]: Message[] } = {};
    
    messages.forEach(message => {
      const date = new Date(message.timestamp);
      const dateKey = format(date, 'yyyy-MM-dd');
      
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      
      groups[dateKey].push(message);
    });
    
    return groups;
  };
  
  const messageGroups = groupMessagesByDate(currentMessages);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (format(date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')) {
      return 'Today';
    }
    
    if (format(date, 'yyyy-MM-dd') === format(yesterday, 'yyyy-MM-dd')) {
      return 'Yesterday';
    }
    
    return format(date, 'MMMM d, yyyy');
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow overflow-y-auto bg-gray-50 p-4">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] ${i % 2 === 0 ? 'bg-blue-100' : 'bg-white'} rounded-lg p-3`}>
                  <Skeleton className="h-4 w-32 mb-2" />
                  <Skeleton className="h-3 w-48" />
                  <Skeleton className="h-3 w-40 mt-1" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {Object.keys(messageGroups).map(dateKey => (
              <div key={dateKey}>
                <div className="flex justify-center my-4">
                  <div className="bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded-full">
                    {formatDate(dateKey)}
                  </div>
                </div>
                
                {messageGroups[dateKey].map((message, index) => {
                  const prevMessage = index > 0 ? messageGroups[dateKey][index - 1] : null;
                  const isSameAuthor = prevMessage && prevMessage.sentByDealer === message.sentByDealer;
                  const timeGap = prevMessage 
                    ? (new Date(message.timestamp).getTime() - new Date(prevMessage.timestamp).getTime()) / (1000 * 60)
                    : Infinity;
                  
                  // Show avatar/spacing if different author or time gap > 2 minutes
                  const showHeader = !isSameAuthor || timeGap > 2;
                  
                  return (
                    <motion.div 
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`flex ${message.sentByDealer ? 'justify-end' : 'justify-start'} ${showHeader ? 'mt-4' : 'mt-1'}`}
                    >
                      <div className={`max-w-[70%] rounded-lg ${
                        message.sentByDealer 
                          ? 'bg-blue-600 text-white rounded-tr-none' 
                          : 'bg-white text-gray-800 rounded-tl-none'
                      } shadow-sm overflow-hidden`}>
                        {message.attachments && message.attachments.length > 0 && (
                          <div className="space-y-1">
                            {message.attachments.map((attachment, i) => (
                              attachment.type === 'image' ? (
                                <div key={i} className="max-w-sm overflow-hidden">
                                  <img 
                                    src={attachment.url} 
                                    alt={attachment.name}
                                    className="w-full h-auto rounded-t-lg"
                                  />
                                </div>
                              ) : (
                                <div key={i} className={`flex items-center p-2 border-b ${
                                  message.sentByDealer ? 'border-blue-500' : 'border-gray-200'
                                }`}>
                                  <Paperclip size={14} className="mr-2" />
                                  <span className="text-sm truncate">{attachment.name}</span>
                                </div>
                              )
                            ))}
                          </div>
                        )}
                        
                        {message.text && (
                          <div className="p-3 whitespace-pre-wrap">
                            {message.text}
                          </div>
                        )}
                        
                        <div className={`text-xs px-3 pb-1 flex items-center justify-end ${
                          message.sentByDealer ? 'text-blue-200' : 'text-gray-500'
                        }`}>
                          {format(new Date(message.timestamp), 'h:mm a')}
                          {message.sentByDealer && (
                            <span className="ml-1">✓{message.isRead ? '✓' : ''}</span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ))}
            
            <AnimatePresence>
              {isTyping && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.3 }}
                  className="flex justify-start mt-4"
                >
                  <div className="bg-white text-gray-800 rounded-lg p-3 shadow-sm">
                    <div className="flex items-center">
                      <span className="animate-pulse">•</span>
                      <span className="animate-pulse animation-delay-150">•</span>
                      <span className="animate-pulse animation-delay-300">•</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </>
        )}
      </div>
      
      <div className="bg-white border-t p-4">
        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {attachments.map((file, index) => (
              <div key={index} className="flex items-center bg-gray-100 rounded-full px-3 py-1 text-sm">
                {file.type.includes('image') ? (
                  <Image size={14} className="mr-1" />
                ) : (
                  <Paperclip size={14} className="mr-1" />
                )}
                <span className="truncate max-w-[150px]">{file.name}</span>
                <button 
                  className="ml-1 text-gray-500 hover:text-gray-700"
                  onClick={() => handleRemoveAttachment(index)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
        
        <div className="flex items-end gap-2">
          <div className="flex-grow relative">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 min-h-[42px] max-h-32 text-sm resize-none"
              rows={1}
              style={{ height: Math.min(120, Math.max(42, newMessage.split('\n').length * 21)) }}
            />
            
            <div className="absolute bottom-1 right-1 flex gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
              >
                <Smile size={18} />
              </Button>
              
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={() => fileInputRef.current?.click()}
              >
                <Paperclip size={18} />
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  multiple
                  onChange={handleFileChange}
                  accept="image/*,.pdf,.doc,.docx"
                />
              </Button>
            </div>
            
            <AnimatePresence>
              {isEmojiPickerOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute bottom-full right-0 mb-2"
                >
                  <EmojiPicker onEmojiClick={handleEmojiClick} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <Button
            type="button"
            disabled={isSending || (!newMessage.trim() && attachments.length === 0)}
            onClick={handleSendMessage}
            className="rounded-full h-10 w-10 p-0 flex-shrink-0"
          >
            {isSending ? (
              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send size={16} />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
