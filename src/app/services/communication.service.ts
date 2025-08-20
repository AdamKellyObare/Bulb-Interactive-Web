import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CommunicationTemplate {
  id: string;
  name: string;
  type: 'email' | 'sms' | 'whatsapp';
  subject?: string;
  content: string;
  variables: string[];
  isActive: boolean;
}

export interface CommunicationCampaign {
  id: string;
  name: string;
  type: 'email' | 'sms' | 'whatsapp';
  templateId: string;
  recipients: string[];
  scheduledAt?: Date;
  status: 'draft' | 'scheduled' | 'sending' | 'completed' | 'failed';
  stats: {
    sent: number;
    delivered: number;
    opened?: number;
    clicked?: number;
    replied?: number;
  };
  createdAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class CommunicationService {
  private apiUrl = 'https://api.bulb.co.ke/communications';

  constructor(private http: HttpClient) {}

  // Templates
  getTemplates(): Observable<CommunicationTemplate[]> {
    return this.http.get<CommunicationTemplate[]>(`${this.apiUrl}/templates`);
  }

  createTemplate(template: Partial<CommunicationTemplate>): Observable<CommunicationTemplate> {
    return this.http.post<CommunicationTemplate>(`${this.apiUrl}/templates`, template);
  }

  updateTemplate(id: string, updates: Partial<CommunicationTemplate>): Observable<CommunicationTemplate> {
    return this.http.put<CommunicationTemplate>(`${this.apiUrl}/templates/${id}`, updates);
  }

  deleteTemplate(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/templates/${id}`);
  }

  // Campaigns
  getCampaigns(): Observable<CommunicationCampaign[]> {
    return this.http.get<CommunicationCampaign[]>(`${this.apiUrl}/campaigns`);
  }

  createCampaign(campaign: Partial<CommunicationCampaign>): Observable<CommunicationCampaign> {
    return this.http.post<CommunicationCampaign>(`${this.apiUrl}/campaigns`, campaign);
  }

  sendCampaign(campaignId: string): Observable<CommunicationCampaign> {
    return this.http.post<CommunicationCampaign>(`${this.apiUrl}/campaigns/${campaignId}/send`, {});
  }

  scheduleCampaign(campaignId: string, scheduledAt: Date): Observable<CommunicationCampaign> {
    return this.http.post<CommunicationCampaign>(`${this.apiUrl}/campaigns/${campaignId}/schedule`, { scheduledAt });
  }

  getCampaignStats(campaignId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/campaigns/${campaignId}/stats`);
  }

  // Direct messaging
  sendEmail(to: string[], subject: string, content: string, templateId?: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/send/email`, { to, subject, content, templateId });
  }

  sendSMS(to: string[], content: string, templateId?: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/send/sms`, { to, content, templateId });
  }

  sendWhatsApp(to: string[], content: string, templateId?: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/send/whatsapp`, { to, content, templateId });
  }

  // Auto-responses
  setupAutoResponse(type: 'email' | 'sms' | 'whatsapp', trigger: string, response: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auto-response`, { type, trigger, response });
  }

  getAutoResponses(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/auto-response`);
  }

  updateAutoResponse(id: string, updates: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/auto-response/${id}`, updates);
  }

  deleteAutoResponse(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/auto-response/${id}`);
  }
}