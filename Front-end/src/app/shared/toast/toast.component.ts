import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { timer } from 'rxjs';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css'],
})
export class ToastComponent implements OnInit, OnDestroy {
  // this is the syntax to call a toast
  // <app-toast [showSuccessToast]="true"/>

  @Input() showSuccessToast?: boolean;
  @Input() showErrorToast?: boolean;
  @Input() message?: string;

  faError = faTriangleExclamation;
  timer$ = timer(5000);
  subscription$ = this.timer$.subscribe(() => {
    this.closeSuccessToast();
    this.closeErrorToast();
  });

  ngOnInit() {
    if (this.showSuccessToast || this.showErrorToast) {
      this.subscription$;
    }
  }

  ngOnDestroy() {
    this.subscription$.unsubscribe();    
  }

  closeSuccessToast() {
    this.showSuccessToast = false;
  }

  closeErrorToast() {
    this.showErrorToast = false;
  }
}
