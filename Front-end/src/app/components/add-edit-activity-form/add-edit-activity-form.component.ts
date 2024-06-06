import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Activity } from 'src/app/models/Activity';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ActivityTypeService } from 'src/app/services/activity-type/activity-type.service';
import { Router } from '@angular/router';
import { ActivityType } from 'src/app/models/ActivityType';

@Component({
  selector: 'app-add-edit-activity-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-edit-activity-form.component.html',
  styleUrl: './add-edit-activity-form.component.css',
})
export class AddEditActivityFormComponent
  implements OnInit, OnDestroy, OnChanges
{
  @Input() activity!: Activity;
  @Input() tripId: number = 0;
  @Input() mode: String = '';
  @Input() date: string = '';
  @Output() submit = new EventEmitter<Activity>();

  activityTypeId: string = '0';
  startTime: string = '12:00';
  endTime: string = '12:00';
  status: String = '';
  activityName: String = '';

  isActivityTypeError: boolean = false;
  isTimeError: boolean = false;
  isParticipantsError: boolean = false;
  isSubmitted: boolean = false;

  activityTypes: ActivityType[] = [];

  activityTypes$: Subscription = new Subscription();

  constructor(
    private router: Router,
    private activityTypeService: ActivityTypeService
  ) {}

  ngOnInit(): void {
    this.getActivityTypes();
  }

  ngOnChanges(): void {
    this.setVariables();
  }

  ngOnDestroy(): void {
    this.activityTypes$.unsubscribe();
  }

  getActivityTypes(): void {
    this.activityTypes$ = this.activityTypeService
      .getActivityTypes()
      .subscribe((result) => (this.activityTypes = result));
  }

  setVariables(): void {
    this.startTime = this.setTime(this.activity.startDate);
    this.endTime = this.setTime(this.activity.endDate);
    this.activityName = this.activity.name;
    this.activityTypeId = this.activity.activityId.toString();
  }

  setTime(activityDate: Date): string {
    let date = new Date(activityDate);

    let time =
      date.getHours() < 10
        ? '0' + date.getHours().toString()
        : date.getHours().toString();
    time += ':';
    time +=
      date.getMinutes() < 10
        ? '0' + date.getMinutes().toString()
        : date.getMinutes().toString();

    return time;
  }

  onSubmitValidate(): void {
    this.isActivityTypeError = this.activityTypeId === '0' ? true : false;
    this.isTimeError = this.startTime > this.endTime ? true : false;
    this.isParticipantsError = this.activity.participants <= 0 ? true : false;

    if (!this.hasErrors()) {
      this.handleSubmit();
    }
  }

  hasErrors(): boolean {
    return (
      this.isActivityTypeError || this.isTimeError || this.isParticipantsError
    );
  }

  setDateTime(time: String): Date {
    let date: Date;

    date =
      this.mode === 'add'
        ? new Date(this.date)
        : new Date(this.activity.startDate);

    date.setHours(Number(time.slice(0, 2)) + 1, Number(time.slice(3, 5)), 0, 0);

    return date;
  }

  handleSubmit(): void {
    this.isSubmitted = true;
    this.activity.activityId = Number(this.activityTypeId);

    if (this.mode === 'add') {
      this.activity.tripId = this.tripId;
      this.activity.startDate = this.setDateTime(this.startTime);
      this.activity.endDate = this.setDateTime(this.endTime);
    }
    if (this.mode === 'edit') {
      this.activity.startDate = this.setDateTime(this.startTime);
      this.activity.endDate = this.setDateTime(this.endTime);
    }

    this.submit.emit(this.activity);
  }

  goToCalendar(): void {
    this.router.navigateByUrl('/calendar');
  }
}
