import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent {
  upcomingEvents: any[] = [
    {
      "id": 1,
      "title": "Family Business: Growth & Succession",
      "image": "https://fc-cdn.fameve.com/floral_credit_f50f/ab0a09b8-7bb6-4c0e-ab0e-eaa85d746c6c.png",
      "url":"https://bulb.fameve.events/events/family-business-growth-succession_49uuh8",
      "date":"31-10-2024"
    },
    {
      "id": 2,
      "title": "Holiday & Travel",
      "image": "https://fc-cdn.fameve.com/floral_credit_f50f/e93d0238-8635-4321-bc87-6d13a537c19b.jpg",
      "url":"https://bulb.fameve.events/events/holiday-travel_38zydz",
      "date":"16-10-2024"
    },
  ];
  showVideoSlider = false;
  constructor(private title: Title, private meta: Meta) {
    this.meta.updateTag({ name: 'description', content: "Bulb Interactive is your one-stop shop for finding upcoming and previous business networking events in Kenya. We have a wide selection of events to choose from, covering all industries and professions. Whether you're looking to connect with industry experts, learn new skills, or simply network with other professionals, we have the perfect event for you."} );
  }
  ngOnInit() {
    this.title.setTitle("Bulb Interactive Events")

  }

}
