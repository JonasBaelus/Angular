import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ToastComponent } from './shared/toast/toast.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthModule } from '@auth0/auth0-angular';
import { environment } from 'src/environments/environment';
import { AuthHttpInterceptor } from '@auth0/auth0-angular';
import { FooterComponent } from './shared/footer/footer.component';
import { ActivityFormComponent } from './components/calender-activity-form/calender-activity-form.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { NgxPaginationModule } from 'ngx-pagination';
import { AddEditActivityFormComponent } from "./components/add-edit-activity-form/add-edit-activity-form.component";
import { ReviewActivityFormComponent } from "./components/review-activity-form/review-activity-form.component";
import { RecaptchaModule } from 'ng-recaptcha';

@NgModule({
    declarations: [AppComponent, ActivityFormComponent],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: AuthHttpInterceptor, multi: true },
    ],
    bootstrap: [AppComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        NavbarComponent,
        FooterComponent,
        ToastComponent,
        FormsModule,
        BrowserAnimationsModule,
        HttpClientModule,
        FontAwesomeModule,
        ReactiveFormsModule,
        NgxPaginationModule,
        RecaptchaModule,
        AuthModule.forRoot({
            domain: environment.AUTH0_DOMAIN,
            clientId: environment.AUTH0_CLIENT_ID,
            authorizationParams: {
                audience: environment.AUTH0_AUDIENCE,
                redirect_uri: window.location.origin
            },
            // The AuthHttpInterceptor configuration
            httpInterceptor: {
                allowedList: [
                    `${environment.api_url}/Trips`,
                    `${environment.api_url}/Trips/*`,
                    `${environment.api_url}/Categories/*`,
                    `${environment.api_url}/UserTrips`,
                    `${environment.api_url}/UserTrips/*`,
                    `${environment.api_url}/TripCategories`,
                    `${environment.api_url}/TripCategories/*`,
                    `${environment.api_url}/TripActivities`,
                    `${environment.api_url}/TripActivities/*`,
                    `${environment.api_url}/Activities`,
                    `${environment.api_url}/Activities/*`,
                    `${environment.api_url}/Email`,
                    `${environment.api_url}/Keywords`,
                    `${environment.api_url}/Keywords/*`,
                    `${environment.api_url}/TripKeywords`,
                    `${environment.api_url}/TripKeywords/*`,
                    `${environment.api_url}/activities/*`,
                    `${environment.api_url}/activities`,
                    `${environment.api_url}/tripactivities/*`,
                    `${environment.api_url}/tripactivities`,
                ],
            },
        }),
        ServiceWorkerModule.register('ngsw-worker.js', {
            enabled: !isDevMode(),
            // Register the ServiceWorker as soon as the application is stable
            // or after 30 seconds (whichever comes first).
            registrationStrategy: 'registerWhenStable:30000'
        }),
        AddEditActivityFormComponent,
        ReviewActivityFormComponent,
    ]
})
export class AppModule {}
