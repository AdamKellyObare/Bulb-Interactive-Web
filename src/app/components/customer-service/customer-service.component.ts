import { Component, OnInit } from '@angular/core';
import { CustomerService } from 'src/app/services/customer.service';
import { CommunicationService } from 'src/app/services/communication.service';
import { Customer } from 'src/app/models/customer.model';

@Component({
  selector: 'app-customer-service',
  templateUrl: './customer-service.component.html',
  styleUrls: ['./customer-service.component.scss']
})
export class CustomerServiceComponent implements OnInit {
  customers: Customer[] = [];
  selectedCustomer: Customer | null = null;
  searchQuery = '';
  filterStatus = 'all';
  
  // Auto-response settings
  autoResponses = {
    whatsapp: {
      enabled: false,
      message: 'Thank you for contacting Bulb Interactive! We will get back to you shortly.'
    },
    email: {
      enabled: false,
      subject: 'Thank you for your inquiry',
      message: 'We have received your message and will respond within 24 hours.'
    },
    sms: {
      enabled: false,
      message: 'Thanks for reaching out! We\'ll contact you soon.'
    }
  };

  constructor(
    private customerService: CustomerService,
    private communicationService: CommunicationService
  ) {}

  ngOnInit(): void {
    this.loadCustomers();
    this.loadAutoResponses();
  }

  loadCustomers(): void {
    this.customerService.customers$.subscribe(customers => {
      this.customers = customers;
    });
  }

  loadAutoResponses(): void {
    this.communicationService.getAutoResponses().subscribe(responses => {
      // Update auto-response settings
      responses.forEach(response => {
        if (this.autoResponses[response.type as keyof typeof this.autoResponses]) {
          this.autoResponses[response.type as keyof typeof this.autoResponses] = {
            ...this.autoResponses[response.type as keyof typeof this.autoResponses],
            ...response
          };
        }
      });
    });
  }

  searchCustomers(): void {
    if (this.searchQuery.trim()) {
      this.customerService.searchCustomers(this.searchQuery).subscribe(customers => {
        this.customers = customers;
      });
    } else {
      this.loadCustomers();
    }
  }

  filterCustomers(): void {
    if (this.filterStatus === 'all') {
      this.loadCustomers();
    } else {
      this.customerService.getCustomersByStatus(this.filterStatus as Customer['status']).subscribe(customers => {
        this.customers = customers;
      });
    }
  }

  selectCustomer(customer: Customer): void {
    this.selectedCustomer = customer;
  }

  addNote(customerId: string, note: string): void {
    this.customerService.addNote(customerId, note).subscribe(() => {
      // Refresh customer data
      this.loadCustomers();
    });
  }

  sendMessage(customerId: string, type: 'email' | 'sms' | 'whatsapp', content: string): void {
    const customer = this.customers.find(c => c.id === customerId);
    if (!customer) return;

    switch (type) {
      case 'email':
        this.communicationService.sendEmail([customer.email], 'Message from Bulb Interactive', content).subscribe();
        break;
      case 'sms':
        this.communicationService.sendSMS([customer.phone], content).subscribe();
        break;
      case 'whatsapp':
        this.communicationService.sendWhatsApp([customer.phone], content).subscribe();
        break;
    }

    // Add interaction record
    this.customerService.addInteraction(customerId, {
      type,
      content,
      direction: 'outbound',
      status: 'sent'
    }).subscribe();
  }

  updateAutoResponse(type: 'email' | 'sms' | 'whatsapp'): void {
    const response = this.autoResponses[type];
    this.communicationService.setupAutoResponse(type, 'new_inquiry', response.message).subscribe();
  }

  exportCustomers(format: 'csv' | 'excel'): void {
    this.customerService.exportCustomers(format).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `customers.${format}`;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }
}