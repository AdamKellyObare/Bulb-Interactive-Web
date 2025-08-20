export interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  endDate?: Date;
  location: string;
  isVirtual: boolean;
  streamLink?: string;
  image: string;
  price: number;
  maxAttendees?: number;
  currentAttendees: number;
  speakers: Speaker[];
  sponsors: Sponsor[];
  attendees: string[]; // User IDs
  agenda: AgendaItem[];
  status: 'upcoming' | 'live' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

export interface Speaker {
  id: string;
  name: string;
  title: string;
  company: string;
  bio: string;
  image: string;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
  };
}

export interface Sponsor {
  id: string;
  name: string;
  logo: string;
  website: string;
  tier: 'platinum' | 'gold' | 'silver' | 'bronze';
}

export interface AgendaItem {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  speaker?: string;
  type: 'presentation' | 'panel' | 'networking' | 'break';
}