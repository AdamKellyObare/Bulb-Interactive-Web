export interface User {
  id: string;
  email: string;
  name: string;
  company?: string;
  phone?: string;
  profileImage?: string;
  membershipType: 'free' | 'premium' | 'vip';
  membershipExpiry?: Date;
  eventsAttended: string[];
  connections: string[];
  createdAt: Date;
  lastActive: Date;
  isVerified: boolean;
}

export interface UserProfile extends User {
  bio?: string;
  industry?: string;
  interests: string[];
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
}