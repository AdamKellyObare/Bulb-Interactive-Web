import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { User, UserProfile } from '../models/user.model';

export interface Connection {
  id: string;
  userId: string;
  connectedUserId: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: Date;
  acceptedAt?: Date;
}

export interface NetworkingEvent {
  id: string;
  eventId: string;
  attendees: UserProfile[];
  connections: Connection[];
  chatRooms: ChatRoom[];
  isActive: boolean;
}

export interface ChatRoom {
  id: string;
  name: string;
  participants: string[];
  messages: ChatMessage[];
  isPrivate: boolean;
  createdAt: Date;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  content: string;
  type: 'text' | 'image' | 'file';
  timestamp: Date;
  isRead: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class NetworkingService {
  private apiUrl = 'https://api.bulb.co.ke/networking';
  private connectionsSubject = new BehaviorSubject<Connection[]>([]);
  public connections$ = this.connectionsSubject.asObservable();

  constructor(private http: HttpClient) {}

  // User Profiles
  getUserProfile(userId: string): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.apiUrl}/profiles/${userId}`);
  }

  updateUserProfile(userId: string, profile: Partial<UserProfile>): Observable<UserProfile> {
    return this.http.put<UserProfile>(`${this.apiUrl}/profiles/${userId}`, profile);
  }

  searchProfiles(query: string, filters?: any): Observable<UserProfile[]> {
    const params = new URLSearchParams();
    params.append('q', query);
    if (filters) {
      Object.keys(filters).forEach(key => {
        if (filters[key]) params.append(key, filters[key]);
      });
    }
    return this.http.get<UserProfile[]>(`${this.apiUrl}/profiles/search?${params.toString()}`);
  }

  // Connections
  getConnections(userId: string): Observable<Connection[]> {
    return this.http.get<Connection[]>(`${this.apiUrl}/connections/${userId}`);
  }

  sendConnectionRequest(userId: string, targetUserId: string): Observable<Connection> {
    return this.http.post<Connection>(`${this.apiUrl}/connections`, { userId, targetUserId });
  }

  acceptConnectionRequest(connectionId: string): Observable<Connection> {
    return this.http.put<Connection>(`${this.apiUrl}/connections/${connectionId}/accept`, {});
  }

  declineConnectionRequest(connectionId: string): Observable<Connection> {
    return this.http.put<Connection>(`${this.apiUrl}/connections/${connectionId}/decline`, {});
  }

  removeConnection(connectionId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/connections/${connectionId}`);
  }

  // Event Networking
  getEventNetworking(eventId: string): Observable<NetworkingEvent> {
    return this.http.get<NetworkingEvent>(`${this.apiUrl}/events/${eventId}`);
  }

  joinEventNetworking(eventId: string, userId: string): Observable<NetworkingEvent> {
    return this.http.post<NetworkingEvent>(`${this.apiUrl}/events/${eventId}/join`, { userId });
  }

  // Chat
  getChatRooms(userId: string): Observable<ChatRoom[]> {
    return this.http.get<ChatRoom[]>(`${this.apiUrl}/chat/rooms/${userId}`);
  }

  createChatRoom(name: string, participants: string[], isPrivate: boolean = false): Observable<ChatRoom> {
    return this.http.post<ChatRoom>(`${this.apiUrl}/chat/rooms`, { name, participants, isPrivate });
  }

  sendMessage(roomId: string, senderId: string, content: string, type: 'text' | 'image' | 'file' = 'text'): Observable<ChatMessage> {
    return this.http.post<ChatMessage>(`${this.apiUrl}/chat/rooms/${roomId}/messages`, { senderId, content, type });
  }

  getMessages(roomId: string, limit: number = 50, offset: number = 0): Observable<ChatMessage[]> {
    return this.http.get<ChatMessage[]>(`${this.apiUrl}/chat/rooms/${roomId}/messages?limit=${limit}&offset=${offset}`);
  }

  markMessagesAsRead(roomId: string, userId: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/chat/rooms/${roomId}/read`, { userId });
  }

  // Membership
  upgradeMembership(userId: string, membershipType: 'premium' | 'vip'): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/membership/upgrade`, { userId, membershipType });
  }

  getMembershipBenefits(membershipType: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/membership/benefits/${membershipType}`);
  }

  checkMembershipDiscount(userId: string, eventId: string): Observable<{ hasDiscount: boolean; discountPercentage: number }> {
    return this.http.get<any>(`${this.apiUrl}/membership/discount/${userId}/${eventId}`);
  }
}