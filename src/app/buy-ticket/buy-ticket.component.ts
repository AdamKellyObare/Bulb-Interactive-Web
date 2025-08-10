import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';

@Component({
  selector: 'app-buy-ticket',
  templateUrl: './buy-ticket.component.html',
  styleUrls: ['./buy-ticket.component.scss']
})
export class BuyTicketComponent {
  constructor(@Inject(DOCUMENT) private document: Document){
    // this.document.location.href = 'https://bulb.fameve.events/events/holiday-travel_38zydz';
    window.location.href='https://bulb.fameve.events/events/holiday-travel_38zydz';
  }



  // ngOnInit(): void {
  //   this.document.location.href = 'https://bulb.fameve.events/events/holiday-travel_38zydz';
  // }


}
