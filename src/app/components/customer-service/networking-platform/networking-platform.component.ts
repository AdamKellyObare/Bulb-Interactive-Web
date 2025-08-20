import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NetworkingService } from 'src/app/services/networking.service';
import { AuthService } from 'src/app/services/auth.service';
import { PaymentService } from 'src/app/services/payment.service';
import { UserProfile, User } from 'src/app/models/user.model';
import { PaymentMethod } from 'src/app/models/payment.model';

interface MembershipPlan {
  type: 'premium' | 'vip';
  name: string;
  price: number;
  duration: string;
  benefits: string[];
}

interface Connection {
  id: string;
  status: 'pending' | 'accepted' | 'declined';
  connectedUser?: {
    id: string;
    name: string;
    company?: string;
    profileImage?: string;
  };
  connectedUserId?: string;
  acceptedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

@Component({
  selector: 'app-networking-platform',
  templateUrl: './networking-platform.component.html',
  styleUrls: ['./networking-platform.component.scss'],
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class NetworkingPlatformComponent implements OnInit {
  // UI State
  showPaymentModal = false;
  isLoading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  // Payment
  selectedPlan: MembershipPlan | null = null;
  selectedPaymentMethod: 'mpesa' | 'card' = 'mpesa';
  paymentMethods: ('mpesa' | 'card')[] = ['mpesa', 'card'];
  mpesaPhone = '';
  cardNumber = '';
  cardExpiry = '';
  cardCvv = '';

  // Data
  currentUser: User | null = null;
  userProfile: UserProfile | null = null;
  searchResults: UserProfile[] = [];
  connections: Connection[] = [];
  searchQuery = '';
  selectedEvent: any = null;
  eventAttendees: UserProfile[] = [];

  membershipPlans: MembershipPlan[] = [
    {
      type: 'premium',
      name: 'Premium',
      price: 5000,
      duration: 'monthly',
      benefits: [
        'Access to all networking events',
        'Connect with unlimited professionals',
        '10% discount on event tickets',
        'Priority customer support',
        'Access to exclusive webinars'
      ]
    },
    {
      type: 'vip',
      name: 'VIP',
      price: 15000,
      duration: 'monthly',
      benefits: [
        'All Premium benefits',
        'Free access to 2 events per month',
        '25% discount on all event tickets',
        'Direct access to speakers',
        'Exclusive VIP networking sessions',
        'Personal account manager'
      ]
    }
  ];

  constructor(
    private networkingService: NetworkingService,
    private authService: AuthService,
    private paymentService: PaymentService
  ) {}

  ngOnInit(): void {
    this.loadCurrentUser();

    // Optional default profile to avoid null issues in template
    if (!this.userProfile) {
      this.userProfile = {
        id: '',
        email: '',
        name: '',
        interests: [],
        membershipType: 'free',
        eventsAttended: [],
        connections: [],
        createdAt: new Date(),
        lastActive: new Date(),
        isVerified: false
      };
    }
  }

  loadCurrentUser(): void {
    this.isLoading = true;
    this.authService.currentUser$.subscribe({
      next: user => {
        this.currentUser = user;
        if (user) {
          this.loadUserProfile();
          this.loadConnections();
        }
        this.isLoading = false;
      },
      error: err => {
        this.errorMessage = 'Failed to load user data';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  loadUserProfile(): void {
    if (!this.currentUser) return;

    this.isLoading = true;
    this.networkingService.getUserProfile(this.currentUser.id).subscribe({
      next: profile => {
        this.userProfile = profile;
        this.isLoading = false;
      },
      error: err => {
        this.errorMessage = 'Failed to load profile';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  loadConnections(): void {
    if (!this.currentUser) return;

    this.isLoading = true;
    this.networkingService.getConnections(this.currentUser.id).subscribe({
      next: connections => {
        this.connections = connections;
        this.isLoading = false;
      },
      error: err => {
        this.errorMessage = 'Failed to load connections';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  searchProfiles(): void {
    if (!this.searchQuery.trim()) return;

    this.isLoading = true;
    this.networkingService.searchProfiles(this.searchQuery).subscribe({
      next: results => {
        this.searchResults = results;
        this.isLoading = false;
      },
      error: err => {
        this.errorMessage = 'Search failed';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  sendConnectionRequest(targetUserId: string): void {
    if (!this.currentUser) return;

    this.isLoading = true;
    this.networkingService.sendConnectionRequest(this.currentUser.id, targetUserId).subscribe({
      next: () => {
        this.successMessage = 'Connection request sent';
        this.isLoading = false;
        const profile = this.searchResults.find(p => p.id === targetUserId);
        if (profile) {
          (profile as any).hasPendingRequest = true;
        }
      },
      error: err => {
        this.errorMessage = 'Failed to send request';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  acceptConnectionRequest(connectionId: string): void {
    this.isLoading = true;
    this.networkingService.acceptConnectionRequest(connectionId).subscribe({
      next: () => {
        this.loadConnections();
        this.isLoading = false;
      },
      error: err => {
        this.errorMessage = 'Failed to accept connection';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  declineConnectionRequest(connectionId: string): void {
    this.isLoading = true;
    this.networkingService.declineConnectionRequest(connectionId).subscribe({
      next: () => {
        this.loadConnections();
        this.isLoading = false;
      },
      error: err => {
        this.errorMessage = 'Failed to decline connection';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  upgradeMembership(membershipType: 'premium' | 'vip'): void {
    if (!this.currentUser) return;

    this.isLoading = true;
    this.networkingService.upgradeMembership(this.currentUser.id, membershipType).subscribe({
      next: updatedUser => {
        this.authService.updateUser(updatedUser);
        this.successMessage = 'Membership upgraded successfully!';
        this.isLoading = false;
      },
      error: err => {
        this.errorMessage = 'Failed to upgrade membership';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  checkMembershipDiscount(eventId: string): void {
    if (!this.currentUser) return;

    this.networkingService.checkMembershipDiscount(this.currentUser.id, eventId).subscribe({
      next: discount => {
        if (discount.hasDiscount) {
          this.successMessage = `You have a ${discount.discountPercentage}% discount!`;
        }
      },
      error: err => {
        this.errorMessage = 'Failed to check discount';
        console.error(err);
      }
    });
  }

  joinEventNetworking(eventId: string): void {
    if (!this.currentUser) return;

    this.isLoading = true;
    this.networkingService.joinEventNetworking(eventId, this.currentUser.id).subscribe({
      next: eventNetworking => {
        this.selectedEvent = eventNetworking;
        this.eventAttendees = eventNetworking.attendees;
        this.isLoading = false;
      },
      error: err => {
        this.errorMessage = 'Failed to join event networking';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  updateProfile(): void {
    if (!this.currentUser || !this.userProfile) return;

    this.isLoading = true;
    this.networkingService.updateUserProfile(this.currentUser.id, this.userProfile).subscribe({
      next: updatedProfile => {
        this.userProfile = updatedProfile;
        this.successMessage = 'Profile updated successfully!';
        this.isLoading = false;
      },
      error: err => {
        this.errorMessage = 'Failed to update profile';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  startChat(userId: string): void {
    if (!this.currentUser) return;

    const participants = [this.currentUser.id, userId];
    this.isLoading = true;
    this.networkingService.createChatRoom('Private Chat', participants, true).subscribe({
      next: chatRoom => {
        this.successMessage = 'Chat started successfully!';
        this.isLoading = false;
      },
      error: err => {
        this.errorMessage = 'Failed to start chat';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  initiatePayment(plan: MembershipPlan): void {
    this.selectedPlan = plan;
    this.showPaymentModal = true;
    this.errorMessage = null;
    this.successMessage = null;
  }

  closePaymentModal(): void {
    this.showPaymentModal = false;
    this.selectedPlan = null;
    this.resetPaymentForm();
  }

  resetPaymentForm(): void {
    this.mpesaPhone = '';
    this.cardNumber = '';
    this.cardExpiry = '';
    this.cardCvv = '';
  }

  isPaymentFormValid(): boolean {
    if (this.selectedPaymentMethod === 'mpesa') {
      return !!this.mpesaPhone && this.mpesaPhone.length >= 10;
    } else {
      return !!this.cardNumber && !!this.cardExpiry && !!this.cardCvv;
    }
  }

  processPayment(): void {
    if (!this.isPaymentFormValid() || !this.selectedPlan || !this.currentUser) {
      this.errorMessage = 'Please complete all payment details';
      return;
    }

    this.isLoading = true;
    const paymentRequest = {
      amount: this.selectedPlan.price,
      currency: 'KES',
      method: this.selectedPaymentMethod === 'mpesa' ? PaymentMethod.MPESA : PaymentMethod.CARD,
      customerEmail: this.currentUser.email,
      customerPhone: this.selectedPaymentMethod === 'mpesa' ? this.mpesaPhone : this.currentUser.phone,
      description: `${this.selectedPlan.name} Membership - ${this.selectedPlan.duration}`,
      cardDetails: this.selectedPaymentMethod === 'card' ? {
        number: this.cardNumber,
        expiry: this.cardExpiry,
        cvv: this.cardCvv
      } : undefined
    };

    this.paymentService.processPayment(paymentRequest).subscribe({
      next: payment => {
        if (payment.status === 'completed') {
          this.upgradeMembership(this.selectedPlan!.type);
          this.successMessage = 'Payment processed successfully!';
          this.closePaymentModal();
        } else {
          this.errorMessage = 'Payment processing failed';
        }
        this.isLoading = false;
      },
      error: err => {
        this.errorMessage = 'Payment processing error';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  // Update Interests safely
  updateInterests(value: string): void {
    if (this.userProfile) {
      this.userProfile.interests = value.split(',').map(i => i.trim());
    }
  }

  // Update social links safely
  updateSocialLink(type: 'linkedin' | 'twitter' | 'website', value: string): void {
    if (!this.userProfile) return;
    if (!this.userProfile.socialLinks) this.userProfile.socialLinks = {};
    this.userProfile.socialLinks[type] = value.trim();
  }

  hasPendingRequests(): boolean {
    return this.connections.some(c => c.status === 'pending');
  }

  getAcceptedConnections(): Connection[] {
    return this.connections.filter(c => c.status === 'accepted');
  }

  getPendingConnections(): Connection[] {
    return this.connections.filter(c => c.status === 'pending');
  }
}
