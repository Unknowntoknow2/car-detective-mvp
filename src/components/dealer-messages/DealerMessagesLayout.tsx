import React, { useState, useEffect } from 'react';
import { useMediaQuery } from '@/hooks/use-mobile';
import { LeadsSidebar } from './sidebar/LeadsSidebar';
import { ChatView } from './chat/ChatView';
import { LeadProfile } from './profile/LeadProfile';
import { useLeads } from './context/LeadsContext';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const DealerMessagesLayout: React.FC = () => {
  const { selectedLeadId, leads, selectedTab, setSelectedTab } = useLeads();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(min-width: 769px) and (max-width: 1024px)');
  const [activeView, setActiveView] = useState<'list' | 'chat' | 'profile'>('list');
  
  // Set activeView based on selection
  useEffect(() => {
    if (selectedLeadId && isMobile) {
      setActiveView('chat');
    } else if (isMobile) {
      setActiveView('list');
    }
  }, [selectedLeadId, isMobile]);

  const handleTabChange = (value: string) => {
    setSelectedTab(value as 'all' | 'unread' | 'archived');
  };

  const handleBackToList = () => {
    setActiveView('list');
  };

  const handleShowProfile = () => {
    setActiveView('profile');
  };

  const handleBackToChat = () => {
    setActiveView('chat');
  };

  const getUnreadCount = (tabType: 'all' | 'unread' | 'archived') => {
    return leads.filter(lead => {
      if (tabType === 'all') return !lead.isArchived && lead.unreadCount > 0;
      if (tabType === 'unread') return !lead.isArchived && lead.unreadCount > 0;
      if (tabType === 'archived') return lead.isArchived && lead.unreadCount > 0;
      return false;
    }).length;
  };

  if (isMobile) {
    return (
      <div className="h-screen flex flex-col bg-gray-100">
        <div className="bg-white py-3 px-4 border-b flex items-center justify-between">
          <h1 className="text-xl font-semibold">Dealer Messages</h1>
          <Tabs value={selectedTab} onValueChange={handleTabChange} className="w-auto">
            <TabsList className="grid grid-cols-3 w-auto">
              <TabsTrigger value="all" className="px-3 relative">
                All
                {getUnreadCount('all') > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {getUnreadCount('all')}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="unread" className="px-3 relative">
                Unread
                {getUnreadCount('unread') > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {getUnreadCount('unread')}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="archived" className="px-3 relative">
                Archived
                {getUnreadCount('archived') > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {getUnreadCount('archived')}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <AnimatePresence>
          {activeView === 'list' && (
            <motion.div 
              key="list"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="flex-grow overflow-hidden"
            >
              <LeadsSidebar onSelectLead={() => setActiveView('chat')} />
            </motion.div>
          )}
          
          {activeView === 'chat' && selectedLeadId && (
            <motion.div 
              key="chat"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col h-full"
            >
              <div className="bg-white px-4 py-3 border-b flex justify-between items-center">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleBackToList}
                  className="mr-2"
                >
                  <ArrowLeft size={16} />
                </Button>
                <div className="flex-grow font-medium truncate">
                  {leads.find(l => l.id === selectedLeadId)?.buyerName}
                </div>
                <Button variant="ghost" size="sm" onClick={handleShowProfile}>
                  Details
                </Button>
              </div>
              <ChatView />
            </motion.div>
          )}
          
          {activeView === 'profile' && selectedLeadId && (
            <motion.div 
              key="profile"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col h-full"
            >
              <div className="bg-white px-4 py-3 border-b flex justify-between items-center">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleBackToChat}
                  className="mr-2"
                >
                  <ArrowLeft size={16} />
                </Button>
                <div className="flex-grow font-medium">Lead Details</div>
              </div>
              <div className="flex-grow overflow-auto">
                <LeadProfile />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  if (isTablet) {
    return (
      <div className="h-screen flex bg-gray-100">
        <div className={`${selectedLeadId ? 'w-1/3' : 'w-full'} border-r bg-white overflow-hidden flex flex-col`}>
          <div className="py-3 px-4 border-b">
            <h1 className="text-xl font-semibold">Dealer Messages</h1>
            <Tabs value={selectedTab} onValueChange={handleTabChange} className="mt-3">
              <TabsList className="grid grid-cols-3">
                <TabsTrigger value="all" className="relative">
                  All
                  {getUnreadCount('all') > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {getUnreadCount('all')}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="unread" className="relative">
                  Unread
                  {getUnreadCount('unread') > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {getUnreadCount('unread')}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="archived" className="relative">
                  Archived
                  {getUnreadCount('archived') > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {getUnreadCount('archived')}
                    </span>
                  )}
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <div className="flex-grow overflow-auto">
            <LeadsSidebar />
          </div>
        </div>
        
        {selectedLeadId && (
          <div className="w-2/3 flex flex-col">
            <div className="bg-white px-4 py-3 border-b flex justify-between items-center">
              <div className="font-medium">
                {leads.find(l => l.id === selectedLeadId)?.buyerName}
              </div>
              <Button variant="ghost" size="sm" onClick={() => setActiveView(activeView === 'chat' ? 'profile' : 'chat')}>
                {activeView === 'chat' ? 'View Details' : 'Back to Chat'}
              </Button>
            </div>
            
            <div className="flex-grow overflow-hidden">
              {activeView === 'chat' ? (
                <ChatView />
              ) : (
                <LeadProfile />
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Desktop view (3-pane layout)
  return (
    <div className="h-screen flex bg-gray-100">
      <div className="w-1/4 border-r bg-white overflow-hidden flex flex-col">
        <div className="py-3 px-4 border-b">
          <h1 className="text-xl font-semibold">Dealer Messages</h1>
          <Tabs value={selectedTab} onValueChange={handleTabChange} className="mt-3">
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="all" className="relative">
                All
                {getUnreadCount('all') > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {getUnreadCount('all')}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="unread" className="relative">
                Unread
                {getUnreadCount('unread') > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {getUnreadCount('unread')}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="archived" className="relative">
                Archived
                {getUnreadCount('archived') > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {getUnreadCount('archived')}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <div className="flex-grow overflow-auto">
          <LeadsSidebar />
        </div>
      </div>
      
      {selectedLeadId ? (
        <>
          <div className="w-1/2 flex flex-col">
            <ChatView />
          </div>
          <div className="w-1/4 border-l bg-white overflow-hidden">
            <LeadProfile />
          </div>
        </>
      ) : (
        <div className="w-3/4 flex items-center justify-center bg-white">
          <div className="text-center p-8 max-w-md">
            <h2 className="text-2xl font-semibold mb-3">Dealer Message Center</h2>
            <p className="text-gray-500 mb-6">Select a lead from the sidebar to view messages and details</p>
          </div>
        </div>
      )}
    </div>
  );
};
