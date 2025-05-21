
import React, { useState } from 'react';
import { Valuation } from '@/types/valuation-history';

interface ChatBubbleProps {
  initialMessage: string;
  position?: 'bottom-right' | 'bottom-left';
  title?: string;
  valuationId?: string;
}

export function ChatBubble({ initialMessage, position = 'bottom-right', title = "Chat Assistance", valuationId }: ChatBubbleProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState(initialMessage);
  
  // This is a stub component - would be implemented with actual chat functionality
  const handleToggleChat = () => {
    setIsOpen(!isOpen);
  };
  
  return (
    <div className={`fixed ${position === 'bottom-right' ? 'right-4' : 'left-4'} bottom-4 z-50`}>
      {isOpen ? (
        <div className="bg-white rounded-lg shadow-lg w-80 sm:w-96 border overflow-hidden">
          <div className="bg-primary p-3 text-white flex justify-between items-center">
            <h3 className="font-medium text-sm">{title}</h3>
            <button onClick={handleToggleChat} className="p-1 hover:bg-primary-dark rounded">
              <span>×</span>
            </button>
          </div>
          <div className="p-4 max-h-96 overflow-y-auto">
            {/* Chat messages would go here */}
            <p className="p-2 bg-gray-100 rounded-lg mb-2">{message}</p>
          </div>
          <div className="p-3 border-t">
            <input 
              type="text"
              className="w-full p-2 border rounded-lg"
              placeholder="Type your message..."
              value=""
              onChange={() => {}}
            />
          </div>
        </div>
      ) : (
        <button
          onClick={handleToggleChat}
          className="bg-primary hover:bg-primary-dark text-white p-3 rounded-full shadow-lg flex items-center justify-center"
        >
          <span className="sr-only">Open chat</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </button>
      )}
    </div>
  );
}
