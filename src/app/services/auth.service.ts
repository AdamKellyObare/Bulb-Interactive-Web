import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    // Initialize with stored user data
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  login(email: string, password: string): Observable<User> {
    // Implement actual login logic here
    return new Observable(observer => {
      // Mock login for now
      const mockUser: User = {
        id: '1',
        email,
        name: 'John Doe',
        company: 'Tech Corp',
        phone: '+254700000000',
        membershipType: 'premium',
        eventsAttended: [],
        connections: [],
        createdAt: new Date(),
        lastActive: new Date(),
        isVerified: true
      };
      
      localStorage.setItem('currentUser', JSON.stringify(mockUser));
      this.currentUserSubject.next(mockUser);
      observer.next(mockUser);
      observer.complete();
    });
  }

  register(userData: Partial<User>): Observable<User> {
    return new Observable(observer => {
      const newUser: User = {
        id: Date.now().toString(),
        email: userData.email!,
        name: userData.name!,
        company: userData.company,
        phone: userData.phone,
        membershipType: 'free',
        eventsAttended: [],
        connections: [],
        createdAt: new Date(),
        lastActive: new Date(),
        isVerified: false
      };
      
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      this.currentUserSubject.next(newUser);
      observer.next(newUser);
      observer.complete();
    });
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }

  updateUser(userData: Partial<User>): Observable<User> {
    return new Observable(observer => {
      const currentUser = this.getCurrentUser();
      if (currentUser) {
        const updatedUser = { ...currentUser, ...userData };
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        this.currentUserSubject.next(updatedUser);
        observer.next(updatedUser);
      }
      observer.complete();
    });
  }
}