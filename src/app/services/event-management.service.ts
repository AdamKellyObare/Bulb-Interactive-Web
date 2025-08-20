import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Event, Speaker, Sponsor } from '../models/event.model';

export interface EventSummary {
  id: string;
  eventId: string;
  summary: string;
  highlights: string[];
  photos: string[];
  videos: string[];
  attendeeCount: number;
  feedback: EventFeedback[];
  materials: EventMaterial[];
  createdAt: Date;
}

export interface EventFeedback {
  id: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface EventMaterial {
  id: string;
  title: string;
  description: string;
  type: 'presentation' | 'document' | 'video' | 'audio' | 'image';
  url: string;
  downloadable: boolean;
  createdAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class EventManagementService {
  private apiUrl = 'https://api.bulb.co.ke/events';
  private eventsSubject = new BehaviorSubject<Event[]>([]);
  public events$ = this.eventsSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadEvents();
  }

  private loadEvents(): void {
    this.getEvents().subscribe(events => {
      this.eventsSubject.next(events);
    });
  }

  // Events
  getEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(this.apiUrl);
  }

  getEvent(id: string): Observable<Event> {
    return this.http.get<Event>(`${this.apiUrl}/${id}`);
  }

  createEvent(event: Partial<Event>): Observable<Event> {
    return this.http.post<Event>(this.apiUrl, event);
  }

  updateEvent(id: string, updates: Partial<Event>): Observable<Event> {
    return this.http.put<Event>(`${this.apiUrl}/${id}`, updates);
  }

  deleteEvent(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Event Registration
  registerForEvent(eventId: string, userId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${eventId}/register`, { userId });
  }

  unregisterFromEvent(eventId: string, userId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${eventId}/register/${userId}`);
  }

  getEventAttendees(eventId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${eventId}/attendees`);
  }

  // Speakers
  addSpeaker(eventId: string, speaker: Partial<Speaker>): Observable<Speaker> {
    return this.http.post<Speaker>(`${this.apiUrl}/${eventId}/speakers`, speaker);
  }

  updateSpeaker(eventId: string, speakerId: string, updates: Partial<Speaker>): Observable<Speaker> {
    return this.http.put<Speaker>(`${this.apiUrl}/${eventId}/speakers/${speakerId}`, updates);
  }

  removeSpeaker(eventId: string, speakerId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${eventId}/speakers/${speakerId}`);
  }

  // Sponsors
  addSponsor(eventId: string, sponsor: Partial<Sponsor>): Observable<Sponsor> {
    return this.http.post<Sponsor>(`${this.apiUrl}/${eventId}/sponsors`, sponsor);
  }

  updateSponsor(eventId: string, sponsorId: string, updates: Partial<Sponsor>): Observable<Sponsor> {
    return this.http.put<Sponsor>(`${this.apiUrl}/${eventId}/sponsors/${sponsorId}`, updates);
  }

  removeSponsor(eventId: string, sponsorId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${eventId}/sponsors/${sponsorId}`);
  }

  // Event Summaries
  getEventSummary(eventId: string): Observable<EventSummary> {
    return this.http.get<EventSummary>(`${this.apiUrl}/${eventId}/summary`);
  }

  createEventSummary(eventId: string, summary: Partial<EventSummary>): Observable<EventSummary> {
    return this.http.post<EventSummary>(`${this.apiUrl}/${eventId}/summary`, summary);
  }

  updateEventSummary(eventId: string, updates: Partial<EventSummary>): Observable<EventSummary> {
    return this.http.put<EventSummary>(`${this.apiUrl}/${eventId}/summary`, updates);
  }

  // Event Materials
  addEventMaterial(eventId: string, material: Partial<EventMaterial>): Observable<EventMaterial> {
    return this.http.post<EventMaterial>(`${this.apiUrl}/${eventId}/materials`, material);
  }

  getEventMaterials(eventId: string): Observable<EventMaterial[]> {
    return this.http.get<EventMaterial[]>(`${this.apiUrl}/${eventId}/materials`);
  }

  deleteEventMaterial(eventId: string, materialId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${eventId}/materials/${materialId}`);
  }

  // Feedback
  submitFeedback(eventId: string, feedback: Partial<EventFeedback>): Observable<EventFeedback> {
    return this.http.post<EventFeedback>(`${this.apiUrl}/${eventId}/feedback`, feedback);
  }

  getEventFeedback(eventId: string): Observable<EventFeedback[]> {
    return this.http.get<EventFeedback[]>(`${this.apiUrl}/${eventId}/feedback`);
  }

  // Live Streaming
  startLiveStream(eventId: string): Observable<{ streamUrl: string; streamKey: string }> {
    return this.http.post<any>(`${this.apiUrl}/${eventId}/stream/start`, {});
  }

  stopLiveStream(eventId: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${eventId}/stream/stop`, {});
  }

  getStreamStatus(eventId: string): Observable<{ isLive: boolean; viewerCount: number }> {
    return this.http.get<any>(`${this.apiUrl}/${eventId}/stream/status`);
  }
}