// payment.model.ts

export enum PaymentMethod {
  MPESA = 'mpesa',
  CARD = 'card',
  PAYPAL = 'paypal'
}

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded'
}

export interface Payment {
  id: string;
  customerId: string;
  eventId?: string;
  amount: number;
  currency: string;
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string;
  metadata?: PaymentMetadata;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentRequest {
  amount: number;
  currency: string;
  method: PaymentMethod;
  customerEmail: string;
  customerPhone?: string;
  description: string;
  eventId?: string;
  metadata?: PaymentMetadata;
}

export interface PaymentMetadata {
  // Common metadata
  ipAddress?: string;
  deviceId?: string;
  
  // M-Pesa specific
  mpesa?: {
    phone: string;
    transactionCode?: string;
    merchantRequestId?: string;
    checkoutRequestId?: string;
  };
  
  // Card specific
  card?: {
    last4: string;
    brand?: 'visa' | 'mastercard' | 'amex' | 'discover' | 'unknown';
    country?: string;
    funding?: 'credit' | 'debit' | 'prepaid' | 'unknown';
    expMonth?: number;
    expYear?: number;
  };
  
  // PayPal specific
  paypal?: {
    payerId?: string;
    paymentId?: string;
    token?: string;
  };
  
  // Custom fields
  [key: string]: any;
}

export interface PaymentResponse {
  success: boolean;
  payment?: Payment;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  redirectUrl?: string; // For payment methods requiring redirect
}

export interface PaymentStatusResponse {
  status: PaymentStatus;
  payment?: Payment;
  lastUpdated: Date;
}

// For card processing
export interface CardDetails {
  number: string;
  expMonth: number;
  expYear: number;
  cvv: string;
  name: string;
  postalCode?: string;
}

// For M-Pesa processing
export interface MpesaDetails {
  phone: string;
  reference?: string;
}

// Type guards
export function isCardPayment(payment: Payment): boolean {
  return payment.method === PaymentMethod.CARD;
}

export function isMpesaPayment(payment: Payment): boolean {
  return payment.method === PaymentMethod.MPESA;
}

export function isPaypalPayment(payment: Payment): boolean {
  return payment.method === PaymentMethod.PAYPAL;
}

// Add to payment.model.ts

/**
 * Type that represents both enum and string literal versions
 * Useful for functions that need to accept either format
 */
export type PaymentMethodLike = PaymentMethod | 'mpesa' | 'card' | 'paypal';

/**
 * Normalizes the payment method to ensure enum value
 */
export function ensurePaymentMethod(method: PaymentMethodLike): PaymentMethod {
  if (typeof method === 'string') {
    return PaymentMethod[method.toUpperCase() as keyof typeof PaymentMethod];
  }
  return method;
}

/**
 * Creates an API-ready payment request (converts enum to string)
 */
export function createApiPaymentRequest(request: PaymentRequest): any {
  return {
    ...request,
    method: request.method.toString() // Convert enum to string
  };
}