
import React, { createContext, useContext, useState } from 'react';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  vehicle: string;
  message: string;
  created_at: string;
}

interface LeadsContextType {
  leads: Lead[];
  addLead: (lead: Omit<Lead, 'id' | 'created_at'>) => void;
  removeLead: (id: string) => void;
}

const LeadsContext = createContext<LeadsContextType | undefined>(undefined);

export const LeadsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [leads, setLeads] = useState<Lead[]>([]);

  const addLead = (leadData: Omit<Lead, 'id' | 'created_at'>) => {
    const newLead: Lead = {
      ...leadData,
      id: Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString(),
    };
    setLeads(prev => [...prev, newLead]);
  };

  const removeLead = (id: string) => {
    setLeads(prev => prev.filter(lead => lead.id !== id));
  };

  return (
    <LeadsContext.Provider value={{ leads, addLead, removeLead }}>
      {children}
    </LeadsContext.Provider>
  );
};

export const useLeads = () => {
  const context = useContext(LeadsContext);
  if (!context) {
    throw new Error('useLeads must be used within a LeadsProvider');
  }
  return context;
};
