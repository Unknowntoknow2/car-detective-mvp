
export interface Lead {
  id: string;
  buyerName: string;
  buyerInitials: string;
  buyerAvatar?: string;
  vehicleInfo: {
    year: number;
    make: string;
    model: string;
    vin: string;
    image?: string;
  };
  lastMessage: {
    text: string;
    timestamp: Date;
    isRead: boolean;
    sentByDealer: boolean;
  };
  unreadCount: number;
  isPinned: boolean;
  isArchived: boolean;
  contactInfo: {
    email: string;
    phone: string;
  };
  offers: Offer[];
  notes: string;
  tags: string[];
}

export interface Message {
  id: string;
  leadId: string;
  text: string;
  timestamp: Date;
  sentByDealer: boolean;
  isRead: boolean;
  attachments?: {
    type: 'image' | 'pdf' | 'gif';
    url: string;
    name: string;
  }[];
}

export interface Offer {
  id: string;
  amount: number;
  timestamp: Date;
  status: 'pending' | 'accepted' | 'rejected' | 'countered';
  sentByDealer: boolean;
  counterAmount?: number;
}

export type TabType = 'all' | 'unread' | 'archived';
