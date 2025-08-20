import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { PaymentService } from 'src/app/services/payment.service';
import { PaymentRequest, Payment, PaymentMethod, PaymentStatus } from 'src/app/models/payment.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription, timer } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit, OnDestroy {
  @Input() amount: number = 0;
  @Input() description: string = '';
  @Input() eventId?: string;
  @Output() paymentComplete = new EventEmitter<Payment>();
  @Output() paymentFailed = new EventEmitter<string>();

  readonly PaymentMethod = PaymentMethod;
  readonly PaymentStatus = PaymentStatus;

  selectedMethod: PaymentMethod = PaymentMethod.MPESA;
  isProcessing = false;
  statusCheckSubscription?: Subscription;
  
  // Reactive Forms
  paymentForm: FormGroup;
  mpesaForm: FormGroup;
  cardForm: FormGroup;

  constructor(
    private paymentService: PaymentService,
    private fb: FormBuilder
  ) {
    // Main form
    this.paymentForm = this.fb.group({
      customerEmail: ['', [Validators.required, Validators.email]],
      customerPhone: ['', [Validators.required, Validators.pattern(/^[0-9]{10,12}$/)]]
    });

    // M-PESA specific form
    this.mpesaForm = this.fb.group({
      mpesaPhone: ['', [Validators.required, Validators.pattern(/^[0-9]{10,12}$/)]]
    });

    // Card specific form
    this.cardForm = this.fb.group({
      cardNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{16}$/)]],
      expiryDate: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/)]],
      cvv: ['', [Validators.required, Validators.pattern(/^[0-9]{3,4}$/)]],
      cardholderName: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.validateAmount();
  }

  ngOnDestroy(): void {
    this.statusCheckSubscription?.unsubscribe();
  }

  private validateAmount(): void {
    if (this.amount <= 0) {
      console.warn('Payment amount must be greater than 0');
    }
  }

  processPayment(): void {
    if (this.isProcessing || !this.isFormValid()) return;
    
    this.isProcessing = true;
    
    const paymentRequest: PaymentRequest = {
      amount: this.amount,
      currency: 'KES',
      method: this.selectedMethod,
      customerEmail: this.paymentForm.value.customerEmail,
      customerPhone: this.selectedMethod === PaymentMethod.MPESA 
        ? this.mpesaForm.value.mpesaPhone 
        : this.paymentForm.value.customerPhone,
      description: this.description,
      eventId: this.eventId,
      metadata: this.getPaymentMetadata()
    };

    this.paymentService.processPayment(paymentRequest).subscribe({
      next: (payment) => this.handlePaymentResponse(payment),
      error: (error) => this.handlePaymentError(error)
    });
  }

  private getPaymentMetadata(): any {
    switch (this.selectedMethod) {
      case PaymentMethod.CARD:
        return {
          last4: this.cardForm.value.cardNumber.slice(-4),
          cardType: this.detectCardType(this.cardForm.value.cardNumber)
        };
      case PaymentMethod.MPESA:
        return {
          phone: this.mpesaForm.value.mpesaPhone
        };
      default:
        return {};
    }
  }

  private detectCardType(cardNumber: string): string {
    // Basic card type detection
    if (/^4/.test(cardNumber)) return 'visa';
    if (/^5[1-5]/.test(cardNumber)) return 'mastercard';
    if (/^3[47]/.test(cardNumber)) return 'amex';
    return 'unknown';
  }

  private handlePaymentResponse(payment: Payment): void {
    this.isProcessing = false;
    
    switch (payment.status) {
      case PaymentStatus.COMPLETED:
        this.paymentComplete.emit(payment);
        break;
      case PaymentStatus.PENDING:
        this.monitorPaymentStatus(payment.id);
        break;
      default:
        this.paymentFailed.emit('Payment failed. Please try again.');
    }
  }

  private handlePaymentError(error: any): void {
    this.isProcessing = false;
    const errorMessage = error.error?.message || error.message || 'Payment processing failed';
    this.paymentFailed.emit(errorMessage);
  }

  private monitorPaymentStatus(paymentId: string): void {
    this.statusCheckSubscription = timer(0, 3000).pipe(
      switchMap(() => this.paymentService.getPaymentStatus(paymentId)),
      takeUntil(timer(300000)) // Stop after 5 minutes
    ).subscribe({
      next: (payment) => {
        if (payment.status === PaymentStatus.COMPLETED) {
          this.paymentComplete.emit(payment);
        } else if (payment.status === PaymentStatus.FAILED) {
          this.paymentFailed.emit('Payment failed. Please try again.');
        }
      },
      error: () => {
        this.paymentFailed.emit('Unable to verify payment status');
      }
    });
  }

  selectPaymentMethod(method: PaymentMethod): void {
    this.selectedMethod = method;
    this.resetStatusCheck();
  }

  private resetStatusCheck(): void {
    this.statusCheckSubscription?.unsubscribe();
    this.statusCheckSubscription = undefined;
  }

  isFormValid(): boolean {
    if (!this.paymentForm.valid || this.amount <= 0) return false;
    
    switch (this.selectedMethod) {
      case PaymentMethod.MPESA:
        return this.mpesaForm.valid;
      case PaymentMethod.CARD:
        return this.cardForm.valid;
      case PaymentMethod.PAYPAL:
        return true;
      default:
        return false;
    }
  }

  formatCardNumber(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\s/g, '');
    
    if (value.length > 16) {
      value = value.substring(0, 16);
    }
    
    input.value = value.replace(/(.{4})/g, '$1 ').trim();
    this.cardForm.patchValue({ cardNumber: value });
  }

  formatExpiryDate(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');
    
    if (value.length >= 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    
    input.value = value;
    this.cardForm.patchValue({ expiryDate: value });
  }

  formatPhone(event: Event, controlName: string): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');
    
    if (value.startsWith('0')) {
      value = '254' + value.substring(1);
    } else if (!value.startsWith('254')) {
      value = '254' + value;
    }
    
    if (controlName === 'mpesaPhone') {
      this.mpesaForm.patchValue({ mpesaPhone: value });
    } else {
      this.paymentForm.patchValue({ customerPhone: value });
    }
  }
}