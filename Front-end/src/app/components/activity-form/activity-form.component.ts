import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivityType } from 'src/app/models/ActivityType';
import { ActivityTypeService } from 'src/app/services/activity-type/activity-type.service';
import { Subscription, delay } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-activity-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './activity-form.component.html',
  styleUrls: ['./activity-form.component.css'],
})
export class ActivityFormComponent implements OnInit, OnDestroy {
  @Output() closeModal: EventEmitter<void> = new EventEmitter<void>();
  @Output() activityUpdated: EventEmitter<void> = new EventEmitter<void>();
  @Input() mode!: string;
  @Input() activityId: number | undefined;

  isAdd: boolean = false;
  isEdit: boolean = false;

  activity: ActivityType = { activityId: 0, name: '' };

  isSubmitted: boolean = false;
  errorMessage: string = '';

  activity$: Subscription = new Subscription();
  postActivity$: Subscription = new Subscription();
  putActivity$: Subscription = new Subscription();

  constructor(private activityTypeService: ActivityTypeService) {}

  ngOnInit(): void {
    if (this.mode === 'add') {
      this.isAdd = true;
    } else if (this.mode === 'edit') {
      this.isEdit = true;
    }

    if (this.isEdit && this.activityId) {
      this.activity$ = this.activityTypeService
        .getActivityTypeById(this.activityId)
        .subscribe((result) => {
          this.activity = result;
        });
    }
  }

  ngOnDestroy(): void {
    this.activity$.unsubscribe();
    this.postActivity$.unsubscribe();
    this.putActivity$.unsubscribe();
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.isAdd) {
      this.postActivity$ = this.activityTypeService
        .postActivityType(this.activity)
        .pipe(delay(1000)) // Adjust the delay time as needed
        .subscribe({
          error: (e) => (this.errorMessage = e.message),
          complete: () => this.sendEmitters(),
        });
    }
    if (this.isEdit) {
      this.putActivity$ = this.activityTypeService
        .putActivityType(this.activityId!, this.activity)
        .pipe(delay(1000)) // Adjust the delay time as needed
        .subscribe({
          error: (e) => (this.errorMessage = e.message),
          complete: () => this.sendEmitters(),
        });
    }
  }

  // Function to fetch updated activities
  sendEmitters() {
    this.activityUpdated.emit();
    this.goBack();
  }

  goBack() {
    this.closeModal.emit();
  }
}
