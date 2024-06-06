import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { take, timer } from 'rxjs';
import { ContactEmailService } from 'src/app/services/contact-email/contact-email.service';
import { ToastComponent } from 'src/app/shared/toast/toast.component';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ToastComponent],
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.css'],
})
export class ContactFormComponent implements OnInit {
  isSend: boolean = false;
  isError: boolean = false;
  email: string = '';
  message: string = '';
  showSuccessToast = false;
  showErrorToast = false;
  successMessage = 'Form submitted successfully';
  errorMessage = 'Form submission failed';
  ngOnInit(): void {}

  constructor(private contactEmailService: ContactEmailService) {}

  submitForm() {
    this.contactEmailService
      .sendContactEmail(this.email, this.message)
      .subscribe((success) => {
        if (success) {
          // Handle success
          this.isSend = true;
          this.showSuccessToast = true;

          timer(5000)
            .pipe(take(1))
            .subscribe(() => {
              this.isSend = false;
              this.showSuccessToast = false;
            });
        } else {
          // Handle failure
          this.isError = true;
          this.showErrorToast = true;
        }
      });
  }
}
