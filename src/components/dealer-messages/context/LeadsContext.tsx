
import React, { createContext, useState, useContext, useEffect } from 'react';
import { Lead, Message, TabType } from '../types';
import { mockLeads, mockMessages } from '../mock-data';
import { toast } from 'sonner';

interface LeadsContextType {
  leads: Lead[];
  messages: Record<string, Message[]>;
  selectedLeadId: string | null;
  selectedTab: TabType;
  setSelectedLeadId: (id: string | null) => void;
  setSelectedTab: (tab: TabType) => void;
  sendMessage: (leadId: string, text: string, attachments?: any[]) => Promise<void>;
  markAsRead: (leadId: string) => void;
  archiveLead: (leadId: string) => void;
  pinLead: (leadId: string) => void;
  updateNotes: (leadId: string, notes: string) => void;
  addTag: (leadId: string, tag: string) => void;
  removeTag: (leadId: string, tag: string) => void;
  isTyping: boolean;
}

const LeadsContext = createContext<LeadsContextType | undefined>(undefined);

export const LeadsProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [leads, setLeads] = useState<Lead[]>(mockLeads);
  const [messages, setMessages] = useState<Record<string, Message[]>>(mockMessages);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(mockLeads[0]?.id || null);
  const [selectedTab, setSelectedTab] = useState<TabType>('all');
  const [isTyping, setIsTyping] = useState(false);

  // Simulate typing indicator randomly for demo purposes
  useEffect(() => {
    if (selectedLeadId) {
      const interval = setInterval(() => {
        const shouldType = Math.random() > 0.7;
        setIsTyping(shouldType);
        
        if (shouldType) {
          setTimeout(() => setIsTyping(false), 3000);
        }
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [selectedLeadId]);

  const sendMessage = async (leadId: string, text: string, attachments: any[] = []) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newMessage: Message = {
      id: Date.now().toString(),
      leadId,
      text,
      timestamp: new Date(),
      sentByDealer: true,
      isRead: false,
      attachments: attachments.map(a => ({
        type: a.type.includes('image') ? 'image' : 'pdf',
        url: URL.createObjectURL(a),
        name: a.name
      }))
    };
    
    // Update messages
    setMessages(prev => ({
      ...prev,
      [leadId]: [...(prev[leadId] || []), newMessage]
    }));
    
    // Update lead last message
    setLeads(prev => 
      prev.map(lead => 
        lead.id === leadId 
          ? {
              ...lead,
              lastMessage: {
                text,
                timestamp: new Date(),
                isRead: false,
                sentByDealer: true
              }
            }
          : lead
      )
    );
    
    toast.success("Message sent successfully");
  };

  const markAsRead = (leadId: string) => {
    setLeads(prev => 
      prev.map(lead => 
        lead.id === leadId 
          ? {
              ...lead,
              unreadCount: 0,
              lastMessage: {
                ...lead.lastMessage,
                isRead: true
              }
            }
          : lead
      )
    );
  };

  const archiveLead = (leadId: string) => {
    setLeads(prev => 
      prev.map(lead => 
        lead.id === leadId 
          ? { ...lead, isArchived: !lead.isArchived }
          : lead
      )
    );
    
    const lead = leads.find(l => l.id === leadId);
    toast.success(`Lead ${lead?.isArchived ? 'unarchived' : 'archived'} 🗂️`);
  };

  const pinLead = (leadId: string) => {
    setLeads(prev => 
      prev.map(lead => 
        lead.id === leadId 
          ? { ...lead, isPinned: !lead.isPinned }
          : lead
      )
    );
    
    const lead = leads.find(l => l.id === leadId);
    toast.success(`Lead ${lead?.isPinned ? 'unpinned' : 'pinned'} 📌`);
  };

  const updateNotes = (leadId: string, notes: string) => {
    setLeads(prev => 
      prev.map(lead => 
        lead.id === leadId 
          ? { ...lead, notes }
          : lead
      )
    );
    toast.success("Notes updated successfully");
  };

  const addTag = (leadId: string, tag: string) => {
    setLeads(prev => 
      prev.map(lead => 
        lead.id === leadId && !lead.tags.includes(tag)
          ? { ...lead, tags: [...lead.tags, tag] }
          : lead
      )
    );
  };

  const removeTag = (leadId: string, tag: string) => {
    setLeads(prev => 
      prev.map(lead => 
        lead.id === leadId
          ? { ...lead, tags: lead.tags.filter(t => t !== tag) }
          : lead
      )
    );
  };

  return (
    <LeadsContext.Provider value={{
      leads,
      messages,
      selectedLeadId,
      selectedTab,
      setSelectedLeadId,
      setSelectedTab,
      sendMessage,
      markAsRead,
      archiveLead,
      pinLead,
      updateNotes,
      addTag,
      removeTag,
      isTyping
    }}>
      {children}
    </LeadsContext.Provider>
  );
};

export const useLeads = () => {
  const context = useContext(LeadsContext);
  if (context === undefined) {
    throw new Error('useLeads must be used within a LeadsProvider');
  }
  return context;
};
