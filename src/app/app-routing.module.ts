import { NgModule } from '@angular/core';
import { ExtraOptions, PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './Home/home/home.component';
import { MagazineComponent } from './magazine/magazine/magazine.component';
import { VideogalleryComponent } from './Gallery/videogallery/videogallery.component';
import { EventsComponent } from './Event/events/events.component';
import { BrandingComponent } from './Branding/branding/branding.component';
import { DisplayComponent } from './News/display/display.component';
import { ListingComponent } from './Listing/listing/listing.component';
import { BlogPostComponent } from './Shared/blog-post/blog-post.component';
import { ReadComponent } from './News/read/read.component';
import { NotfoundComponent } from './Shared/notfound/notfound.component';
import { EventDetailsComponent } from './Event/event-details/event-details.component';
import { PastEventsComponent } from './past-events/past-events.component';
import { BuyTicketComponent } from './buy-ticket/buy-ticket.component';
import { BuyTicketGuard } from './guards/buy-ticket.guard';


const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'magazine', component: MagazineComponent },
  { path: 'videos', component: VideogalleryComponent },
  { path: 'events', component: EventsComponent },
  { path: 'past-events', component: PastEventsComponent },
  { path: 'branding', component: BrandingComponent },
  { path: 'news', component: DisplayComponent },
  { path: 'listing', component: ListingComponent },
  { path: 'blog/:id', component: BlogPostComponent },
  { path: 'news/:id', component: ReadComponent },
  { path: 'events/:id', component: EventDetailsComponent},
  { path: 'buy-tickets', component: BuyTicketComponent, canActivate: [BuyTicketGuard]},
  { path: '**', component: NotfoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true, scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
