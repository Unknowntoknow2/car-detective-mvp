import React, { useEffect } from 'react';
import { useLeads } from '../context/LeadsContext';
import { Lead, TabType } from '../types';
import { AnimatePresence, motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { Archive, CheckSquare, Pin, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

interface LeadsSidebarProps {
  onSelectLead?: () => void;
}

export const LeadsSidebar: React.FC<LeadsSidebarProps> = ({ onSelectLead }) => {
  const { 
    leads, 
    selectedLeadId, 
    selectedTab, 
    setSelectedLeadId, 
    markAsRead, 
    archiveLead, 
    pinLead 
  } = useLeads();
  
  const [isLoading, setIsLoading] = React.useState(true);

  // Simulate initial loading state for demo
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Filter leads based on selected tab
  const filteredLeads = leads.filter(lead => {
    if (selectedTab === 'all') return !lead.isArchived;
    if (selectedTab === 'unread') return !lead.isArchived && lead.unreadCount > 0;
    if (selectedTab === 'archived') return lead.isArchived;
    return true;
  });

  // Sort leads: pinned first, then by unread status, then by timestamp
  const sortedLeads = [...filteredLeads].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    
    if (a.unreadCount > 0 && b.unreadCount === 0) return -1;
    if (a.unreadCount === 0 && b.unreadCount > 0) return 1;
    
    return new Date(b.lastMessage.timestamp).getTime() - new Date(a.lastMessage.timestamp).getTime();
  });

  const handleLeadSelect = (leadId: string) => {
    setSelectedLeadId(leadId);
    markAsRead(leadId);
    if (onSelectLead) onSelectLead();
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    return formatDistanceToNow(date, { addSuffix: false });
  };

  if (isLoading) {
    return (
      <div className="py-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="px-3 py-2">
            <div className="flex items-center space-x-3 mb-2">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-4 w-24 mb-1" />
                <Skeleton className="h-3 w-32" />
              </div>
              <Skeleton className="h-3 w-8" />
            </div>
            <Skeleton className="h-3 w-full mt-2" />
          </div>
        ))}
      </div>
    );
  }

  if (sortedLeads.length === 0) {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <div className="text-center">
          <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <h3 className="text-lg font-medium mb-1">No messages</h3>
          {selectedTab === 'all' && <p className="text-sm text-gray-500">You don't have any leads yet</p>}
          {selectedTab === 'unread' && <p className="text-sm text-gray-500">No unread messages</p>}
          {selectedTab === 'archived' && <p className="text-sm text-gray-500">No archived leads</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="py-2">
      <AnimatePresence initial={false}>
        {sortedLeads.map((lead) => (
          <LeadCard 
            key={lead.id} 
            lead={lead} 
            isSelected={lead.id === selectedLeadId} 
            onSelect={handleLeadSelect}
            onArchive={archiveLead}
            onPin={pinLead}
            onMarkAsRead={markAsRead}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

interface LeadCardProps {
  lead: Lead;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onArchive: (id: string) => void;
  onPin: (id: string) => void;
  onMarkAsRead: (id: string) => void;
}

const LeadCard: React.FC<LeadCardProps> = ({ 
  lead, 
  isSelected, 
  onSelect, 
  onArchive, 
  onPin, 
  onMarkAsRead 
}) => {
  const [isHovered, setIsHovered] = React.useState(false);
  
  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    return formatDistanceToNow(date, { addSuffix: false });
  };
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0, marginTop: 0, marginBottom: 0, paddingTop: 0, paddingBottom: 0 }}
      transition={{ duration: 0.2 }}
      className={`relative px-3 py-2 cursor-pointer ${
        isSelected ? 'bg-blue-50' : isHovered ? 'bg-gray-50' : ''
      }`}
      onClick={() => onSelect(lead.id)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start space-x-3">
        {lead.buyerAvatar ? (
          <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
            <img 
              src={lead.buyerAvatar} 
              alt={lead.buyerName} 
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
            {lead.buyerInitials}
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-baseline">
            <h3 className={`font-medium text-sm truncate ${lead.unreadCount > 0 ? 'text-black' : 'text-gray-700'}`}>
              {lead.buyerName}
            </h3>
            <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
              {formatTime(new Date(lead.lastMessage.timestamp))}
            </span>
          </div>
          
          <div className="flex items-center gap-1 mb-1">
            <span className="text-xs text-gray-500 truncate">
              {lead.vehicleInfo.year} {lead.vehicleInfo.make} {lead.vehicleInfo.model}
            </span>
          </div>
          
          <p className={`text-sm truncate ${lead.unreadCount > 0 ? 'font-medium text-black' : 'text-gray-600'}`}>
            {lead.lastMessage.sentByDealer && 'You: '}{lead.lastMessage.text}
          </p>
        </div>
      </div>
      
      {/* Indicators */}
      <div className="flex mt-1 gap-1.5">
        {lead.isPinned && (
          <span className="inline-flex items-center bg-yellow-50 px-1.5 py-0.5 rounded text-xs text-yellow-700">
            <Pin size={10} className="mr-1" /> Pinned
          </span>
        )}
        
        {lead.unreadCount > 0 && (
          <span className="inline-flex items-center bg-blue-50 px-1.5 py-0.5 rounded text-xs text-blue-700">
            New
          </span>
        )}
      </div>
      
      {/* Hover Actions */}
      <AnimatePresence>
        {isHovered && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute top-2 right-2 flex space-x-1"
          >
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7" 
              onClick={(e) => {
                e.stopPropagation();
                onArchive(lead.id);
              }}
              title={lead.isArchived ? "Unarchive" : "Archive"}
            >
              <Archive size={14} />
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7" 
              onClick={(e) => {
                e.stopPropagation();
                onPin(lead.id);
              }}
              title={lead.isPinned ? "Unpin" : "Pin"}
            >
              <Pin size={14} className={lead.isPinned ? "text-yellow-500" : ""} />
            </Button>
            
            {lead.unreadCount > 0 && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-7 w-7" 
                onClick={(e) => {
                  e.stopPropagation();
                  onMarkAsRead(lead.id);
                }}
                title="Mark as read"
              >
                <CheckSquare size={14} />
              </Button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
