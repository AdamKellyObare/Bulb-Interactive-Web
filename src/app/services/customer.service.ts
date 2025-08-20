import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Customer, CustomerInteraction, CustomerNote } from '../models/customer.model';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private apiUrl = 'https://api.bulb.co.ke/customers';
  private customersSubject = new BehaviorSubject<Customer[]>([]);
  public customers$ = this.customersSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadCustomers();
  }

  private loadCustomers(): void {
    this.getCustomers().subscribe(customers => {
      this.customersSubject.next(customers);
    });
  }

  getCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(this.apiUrl);
  }

  getCustomer(id: string): Observable<Customer> {
    return this.http.get<Customer>(`${this.apiUrl}/${id}`);
  }

  createCustomer(customer: Partial<Customer>): Observable<Customer> {
    return this.http.post<Customer>(this.apiUrl, customer);
  }

  updateCustomer(id: string, updates: Partial<Customer>): Observable<Customer> {
    return this.http.put<Customer>(`${this.apiUrl}/${id}`, updates);
  }

  deleteCustomer(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  addNote(customerId: string, note: string): Observable<CustomerNote> {
    return this.http.post<CustomerNote>(`${this.apiUrl}/${customerId}/notes`, { content: note });
  }

  addInteraction(customerId: string, interaction: Partial<CustomerInteraction>): Observable<CustomerInteraction> {
    return this.http.post<CustomerInteraction>(`${this.apiUrl}/${customerId}/interactions`, interaction);
  }

  searchCustomers(query: string): Observable<Customer[]> {
    return this.http.get<Customer[]>(`${this.apiUrl}/search?q=${encodeURIComponent(query)}`);
  }

  getCustomersByStatus(status: Customer['status']): Observable<Customer[]> {
    return this.http.get<Customer[]>(`${this.apiUrl}?status=${status}`);
  }

  getCustomersByTag(tag: string): Observable<Customer[]> {
    return this.http.get<Customer[]>(`${this.apiUrl}?tag=${encodeURIComponent(tag)}`);
  }

  exportCustomers(format: 'csv' | 'excel'): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/export?format=${format}`, { responseType: 'blob' });
  }
}