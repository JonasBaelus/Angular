import { Component, ElementRef, ViewChild } from '@angular/core';

import { CommonModule } from '@angular/common';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterModule } from '@angular/router';
import { ContactFormComponent } from '../contact-form/contact-form.component';
import { FooterComponent } from 'src/app/shared/footer/footer.component';
import { NavbarComponent } from 'src/app/shared/navbar/navbar.component';
import { ToastComponent } from 'src/app/shared/toast/toast.component';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [
    CommonModule,
    RouterModule,
    FontAwesomeModule,
    ToastComponent,
    NavbarComponent,
    FooterComponent,
    ContactFormComponent,
  ],
})
export class HomeComponent {
  faLocation = faLocationDot;

  isSuccess: boolean = false;
  isError: boolean = false;

  subscribe(emailInput: any, email: string) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    if (email.match(emailRegex)) {
      // Email is valid, you can proceed with further actions
      this.isSuccess = true;
    } else {
      // Email is not valid
      this.isError = true;
    }

    // Clear messages after a delay
    setTimeout(() => {
      this.isSuccess = false;
      this.isError = false;
    }, 5000); // Clear messages after 5 seconds
  }
}
