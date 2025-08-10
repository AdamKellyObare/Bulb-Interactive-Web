import { TestBed } from '@angular/core/testing';

import { BuyTicketGuard } from './buy-ticket.guard';

describe('BuyTicketGuard', () => {
  let guard: BuyTicketGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(BuyTicketGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
