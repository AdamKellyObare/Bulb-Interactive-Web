import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Payment, PaymentRequest } from '../models/payment.model';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = 'https://api.bulb.co.ke/payments'; // Replace with actual API

  constructor(private http: HttpClient) {}

  processPayment(paymentRequest: PaymentRequest): Observable<Payment> {
    switch (paymentRequest.method) {
      case 'mpesa':
        return this.processMpesaPayment(paymentRequest);
      case 'card':
        return this.processCardPayment(paymentRequest);
      case 'paypal':
        return this.processPayPalPayment(paymentRequest);
      default:
        throw new Error('Unsupported payment method');
    }
  }

  private processMpesaPayment(request: PaymentRequest): Observable<Payment> {
    return this.http.post<Payment>(`${this.apiUrl}/mpesa`, request);
  }

  private processCardPayment(request: PaymentRequest): Observable<Payment> {
    return this.http.post<Payment>(`${this.apiUrl}/card`, request);
  }

  private processPayPalPayment(request: PaymentRequest): Observable<Payment> {
    return this.http.post<Payment>(`${this.apiUrl}/paypal`, request);
  }

  getPaymentStatus(paymentId: string): Observable<Payment> {
    return this.http.get<Payment>(`${this.apiUrl}/${paymentId}`);
  }

  getPaymentHistory(customerId: string): Observable<Payment[]> {
    return this.http.get<Payment[]>(`${this.apiUrl}/history/${customerId}`);
  }

  refundPayment(paymentId: string, reason?: string): Observable<Payment> {
    return this.http.post<Payment>(`${this.apiUrl}/${paymentId}/refund`, { reason });
  }
}