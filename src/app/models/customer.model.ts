export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  source: 'website' | 'event' | 'referral' | 'social';
  status: 'lead' | 'prospect' | 'customer' | 'inactive';
  tags: string[];
  notes: CustomerNote[];
  interactions: CustomerInteraction[];
  eventsAttended: string[];
  totalSpent: number;
  lastContactDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CustomerNote {
  id: string;
  content: string;
  createdBy: string;
  createdAt: Date;
}

export interface CustomerInteraction {
  id: string;
  type: 'email' | 'sms' | 'whatsapp' | 'call' | 'meeting' | 'event';
  content: string;
  direction: 'inbound' | 'outbound';
  status: 'sent' | 'delivered' | 'read' | 'replied';
  createdAt: Date;
}