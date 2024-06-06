import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Activity } from 'src/app/models/Activity';
import { ActivityService } from 'src/app/services/activity/activity.service';

@Component({
  selector: 'app-calender-activity-form',
  templateUrl: './calender-activity-form.component.html',
  styleUrls: ['./calender-activity-form.component.css'],
})
export class ActivityFormComponent implements OnInit, OnDestroy {
  activityId: number = 0;
  tripId: number = 0;

  date: string = '';
  status: String = '';
  errorMessage: String = '';
  mode: String = '';

  isSubmitted: boolean = false;

  activity: Activity = {
    tripActivityId: 0,
    activityId: 0,
    tripId: 0,
    name: '',
    description: null,
    participants: 0,
    review: null,
    score: null,
    startDate: new Date(),
    endDate: new Date(),
    activity: {
      activityId: 0,
      name: '',
    },
  };

  activity$: Subscription = new Subscription();
  postActivity$: Subscription = new Subscription();
  putActivity$: Subscription = new Subscription();

  constructor(
    private router: Router,
    private activityService: ActivityService
  ) {
    this.mode = this.router.getCurrentNavigation()?.extras.state?.['mode'];
    this.activityId = +this.router.getCurrentNavigation()?.extras.state?.['id'];
    this.tripId = +this.router.getCurrentNavigation()?.extras.state?.['tripId'];
    this.date = this.router.getCurrentNavigation()?.extras.state?.['date'];
    this.status = this.router.getCurrentNavigation()?.extras.state?.['status'];

    if (this.activityId != null && this.activityId > 0) {
      this.activity$ = this.activityService
        .getActivityById(this.activityId)
        .subscribe((result) => {
          this.activity = result;
        });
    }
  }
  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.activity$.unsubscribe();
    this.postActivity$.unsubscribe();
    this.putActivity$.unsubscribe();
  }

  submit(activity: Activity): void {
    if (this.mode === 'add') {
      this.postActivity$ = this.activityService
        .postActivity(activity)
        .subscribe({
          next: (v) =>
            this.router.navigate(['/calendar'], { state: { mode: 'add' } }),
          error: (e) =>
            (this.errorMessage =
              'Something went wrong with creating the activity.'),
        });
    }
    if (this.mode === 'edit') {
      this.putActivity$ = this.activityService
        .putActivity(this.activityId, activity)
        .subscribe({
          next: (v) =>
            this.router.navigate(['/calendar'], { state: { mode: 'edit' } }),
          error: (e) =>
            (this.errorMessage =
              'Something went wrong with updating the activity.'),
        });
    }
  }
}
