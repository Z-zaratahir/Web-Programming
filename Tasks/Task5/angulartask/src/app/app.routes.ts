import { Routes } from '@angular/router';

import { Dashboard } from './dashboard/dashboard';
import { HomeComponent } from './home/home';
import { AboutComponent } from './about/about';
import { FeedbackComponent } from './feedback/feedback';

export const routes: Routes = [
  {
    path: 'dashboard',
    component: Dashboard,
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'about', component: AboutComponent },
      { path: 'feedback', component: FeedbackComponent },
      { path: '', redirectTo: 'home', pathMatch: 'full' }
    ]
  },
  { path: '', redirectTo: 'dashboard/home', pathMatch: 'full' },
  { path: '**', redirectTo: 'dashboard/home' }
];
