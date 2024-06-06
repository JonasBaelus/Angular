import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GetstartedComponent } from './components/getstarted/getstarted.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { CategoryListComponent } from './components/category/category.component';
import { PublicTripsComponent } from './components/public-trips/public-trips.component';
import { CategoryFormComponent } from './components/category-form/category-form.component';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { ActivityFormComponent } from './components/calender-activity-form/calender-activity-form.component';
import { TripComponent } from './components/trip/trip.component';
import { ActivityListComponent } from './components/activity/activity.component';
import { HomeComponent } from './components/home/home.component';
import { PublicApiTestComponent } from './components/public-api-test/public-api-test.component';
import { adminGuard } from './guards/admin.guard';
import { AuthGuard } from '@auth0/auth0-angular';
import { AdminComponent } from './components/admin/admin.component';
import { UserComponent } from './components/user/user.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { ContactFormComponent } from './components/contact-form/contact-form.component';

const routes: Routes = [
  {
    path: '',
    component: UserComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'getstarted', component: GetstartedComponent },
      { path: 'calendar', component: CalendarComponent },
      { path: 'calendar/activity', component: ActivityFormComponent },
      { path: 'trips', component: TripComponent, canActivate: [AuthGuard] },
      {
        path: 'public-trips',
        component: PublicTripsComponent,
        canActivate: [AuthGuard],
      },
      { path: 'aboutus', component: AboutUsComponent },
      { path: 'profile', component: UserProfileComponent },
      { path: 'contact', component: ContactFormComponent },
    ],
  },
  {
    path: 'admin',
    component: AdminComponent,
    children: [
      {
        path: 'category',
        component: CategoryListComponent,
        canActivate: [adminGuard],
      },
      {
        path: 'category/form',
        component: CategoryFormComponent,
        canActivate: [adminGuard],
      },
      {
        path: 'activity',
        component: ActivityListComponent,
        canActivate: [adminGuard],
      },
      {
        path: 'activity/form',
        component: ActivityFormComponent,
        canActivate: [adminGuard],
      },
      {
        path: 'users',
        component: UserListComponent,
        canActivate: [adminGuard],
      },
    ],
  },
  { path: 'api', component: PublicApiTestComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
