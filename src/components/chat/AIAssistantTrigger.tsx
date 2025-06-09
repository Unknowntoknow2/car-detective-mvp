
import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import AINFloatingChat from './AINFloatingChat';

const AINAssistantTrigger = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 bg-primary hover:bg-primary-hover text-white rounded-full p-4 shadow-lg transition-all duration-300 hover:scale-105"
        aria-label="Open AI Assistant"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>
      
      {isOpen && (
        <AINFloatingChat onClose={() => setIsOpen(false)} />
      )}
    </>
  );
};

export default AINAssistantTrigger;
