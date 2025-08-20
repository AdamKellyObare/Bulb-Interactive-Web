import { NgModule } from '@angular/core';
import { ExtraOptions, PreloadAllModules, RouterModule, Routes } from '@angular/router';

// Main Components
import { HomeComponent } from './Home/home/home.component';
import { MagazineComponent } from './magazine/magazine/magazine.component';
import { VideogalleryComponent } from './Gallery/videogallery/videogallery.component';
import { EventsComponent } from './Event/events/events.component';
import { BrandingComponent } from './Branding/branding/branding.component';
import { DisplayComponent } from './News/display/display.component';
import { ListingComponent } from './Listing/listing/listing.component';

// Shared Components
import { BlogPostComponent } from './Shared/blog-post/blog-post.component';
import { NotfoundComponent } from './Shared/notfound/notfound.component';

// Feature Components
import { ReadComponent } from './News/read/read.component';
import { EventDetailsComponent } from './Event/event-details/event-details.component';
import { PastEventsComponent } from './past-events/past-events.component';
import { BuyTicketComponent } from './buy-ticket/buy-ticket.component';
import { CustomerServiceComponent } from './components/customer-service/customer-service.component';
import { NetworkingPlatformComponent } from './components/customer-service/networking-platform/networking-platform.component';
// import { NetworkingComponent } from './components/customer-service/networking-platform/networking-platform.component';

// Guards
import { BuyTicketGuard } from './guards/buy-ticket.guard';

const routes: Routes = [
    { 
    path: 'networking',
    component: NetworkingPlatformComponent,
    data: { 
      title: 'Networking Platform',
      animation: 'NetworkingPage'
    }
  },
  {
    path: 'customer-service',
    component: CustomerServiceComponent,
    data: { 
      title: 'Customer Support',
      breadcrumb: 'Support Center'
    }
  },
  { 
    path: '', 
    redirectTo: 'home', 
    pathMatch: 'full' 
  },
  { 
    path: 'home',
    component: HomeComponent,
    data: { 
      title: 'Home',
      animation: 'HomePage' 
    }
  },
  { 
    path: 'magazine',
    component: MagazineComponent,
    data: { 
      title: 'Magazine',
      animation: 'MagazinePage'
    }
  },
  { 
    path: 'videos',
    component: VideogalleryComponent,
    data: { 
      title: 'Video Gallery',
      animation: 'VideosPage'
    }
  },
  { 
    path: 'events',
    component: EventsComponent,
    data: { 
      title: 'Events',
      animation: 'EventsPage'
    }
  },
  { 
    path: 'past-events',
    component: PastEventsComponent,
    data: { 
      title: 'Past Events',
      animation: 'PastEventsPage'
    }
  },
  { 
    path: 'branding',
    component: BrandingComponent,
    data: { 
      title: 'Branding Solutions',
      animation: 'BrandingPage'
    }
  },
  { 
    path: 'news',
    component: DisplayComponent,
    data: { 
      title: 'News',
      animation: 'NewsPage'
    }
  },
  { 
    path: 'listing',
    component: ListingComponent,
    data: { 
      title: 'Directory Listing',
      animation: 'ListingPage'
    }
  },
  { 
    path: 'blog/:id',
    component: BlogPostComponent,
    data: { 
      title: 'Blog Post',
      animation: 'BlogPage'
    }
  },
  { 
    path: 'news/:id',
    component: ReadComponent,
    data: { 
      title: 'News Article',
      animation: 'ArticlePage'
    }
  },
  { 
    path: 'events/:id',
    component: EventDetailsComponent,
    data: { 
      title: 'Event Details',
      animation: 'EventDetailsPage'
    }
  },
  { 
    path: 'buy-tickets',
    component: BuyTicketComponent,
    canActivate: [BuyTicketGuard],
    data: { 
      title: 'Buy Tickets',
      animation: 'TicketsPage'
    }
  },
  { 
    path: '**',
    component: NotfoundComponent,
    data: { 
      title: 'Page Not Found',
      animation: 'NotFoundPage'
    }
  },

];

const routerConfig: ExtraOptions = {
  useHash: false,
  scrollPositionRestoration: 'enabled',
  preloadingStrategy: PreloadAllModules,
  enableTracing: true, // Set to true for debugging routes
  anchorScrolling: 'enabled',
  onSameUrlNavigation: 'reload'
};


@NgModule({
  imports: [RouterModule.forRoot(routes, routerConfig)],
  exports: [RouterModule],
  providers: [
    // Add any route-specific providers here if needed
  ]
})
export class AppRoutingModule { }