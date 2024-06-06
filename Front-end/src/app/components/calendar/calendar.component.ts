import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  IconDefinition,
  faCalendarCheck,
  faCalendarPlus,
  faCalendarXmark,
  faCircle,
  faGopuram,
  faLandmark,
  faPersonHiking,
  faPlus,
  faQuestion,
  faWeightHanging,
} from '@fortawesome/free-solid-svg-icons';
import { TripService } from '../../services/trip/trip.service';
import { Subscription } from 'rxjs';
import { Trip } from '../../models/Trip';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { PageLoaderComponent } from '../../shared/page-loader/page-loader.component';
import { Activity } from 'src/app/models/Activity';
import { ConfirmationPopupComponent } from '../../shared/confirmation-popup/confirmation-popup.component';
import { CalendarDetailModalComponent } from '../calendar-detail-modal/calendar-detail-modal.component';
import { ToastComponent } from '../../shared/toast/toast.component';

@Component({
  selector: 'app-calendar',
  standalone: true,
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
  imports: [
    CommonModule,
    FontAwesomeModule,
    NavbarComponent,
    PageLoaderComponent,
    ConfirmationPopupComponent,
    CalendarDetailModalComponent,
    ToastComponent,
  ],
})
export class CalendarComponent implements OnInit, OnDestroy {
  trip!: Trip;
  activity!: Activity;
  tripId: number = 0;
  mode: String = '';

  dates: { date: Date; status: String; activities: Activity[] }[] = [];
  today: Date = new Date();
  modalDayStatus: String = '';

  isLoading: boolean = true;
  isModalOpen: boolean = false;
  isPublic: boolean = false;

  trip$: Subscription = new Subscription();
  tripId$: Subscription = new Subscription();

  faPast = faCalendarCheck;
  faPresent = faCalendarXmark;
  faFuture = faCalendarPlus;
  faPlus = faPlus;
  faQuestion = faQuestion;

  constructor(private tripService: TripService, private router: Router) {
    this.isPublic =
      this.router.getCurrentNavigation()?.extras.state?.['isPublic'] === 'true';
    this.mode = this.router.getCurrentNavigation()?.extras.state?.['mode'];
  }

  ngOnInit(): void {
    this.getTripId();
    this.getTripById(this.tripId);
  }

  ngOnDestroy(): void {
    this.trip$.unsubscribe();
    this.tripId$.unsubscribe();
  }

  getTripId(): void {
    this.tripId$ = this.tripService.tripId$.subscribe((id: number) => {
      if (id !== 0) {
        this.tripId = id;
      }
    });
  }

  getTripById(id: number) {
    this.trip$ = this.tripService.getTripById(id).subscribe((result) => {
      this.trip = result;
      this.getDates(result.startDate, result.endDate);
      this.filterActivities(this.trip);
      this.isLoading = false;
    });
  }

  getDates(startDate: Date, endDate: Date): void {
    let currentDate: Date = startDate;
    let status: String = '';

    while (currentDate <= endDate) {
      status = this.checkDateStatus(currentDate);
      this.dates.push({ date: new Date(currentDate), status, activities: [] });
      currentDate = this.addDays(currentDate);
      endDate = new Date(endDate);
    }
  }

  checkDateStatus(checkDate: Date): String {
    let date = new Date(checkDate);
    date.setHours(0, 0, 0, 0);
    this.today.setHours(0, 0, 0, 0);

    if (date < this.today) {
      return 'Past';
    } else if (
      date.getDate() === this.today.getDate() &&
      date.getMonth() === this.today.getMonth() &&
      date.getFullYear() === this.today.getFullYear()
    ) {
      return 'Present';
    } else {
      return 'Future';
    }
  }

  addDays(currentDate: Date): Date {
    let date = new Date(currentDate);

    date.setDate(date.getDate() + 1);
    return date;
  }

  filterActivities(trip: Trip): void {
    let filtered: Activity[];
    this.dates.forEach(function (date) {
      filtered = trip.activities.filter((obj) => {
        let activityDate = new Date(obj.startDate);
        let checkDate = new Date(date.date);
        activityDate.setHours(0, 0, 0, 0);
        checkDate.setHours(0, 0, 0, 0);

        return activityDate.getTime() === checkDate.getTime();
      });

      date.activities = filtered;
    });
  }

  isOnTripDay(checkDate: Date, activityDate: Date): boolean {
    let date = new Date(activityDate);

    return (
      checkDate.getDate() === date.getDate() &&
      checkDate.getMonth() === date.getMonth()
    );
  }

  isNow(startDate: Date, endDate: Date): boolean {
    const now = new Date();

    return new Date(startDate) <= now && now <= new Date(endDate);
  }

  getIcon(name: string): IconDefinition {
    const iconMapping: { [key: string]: IconDefinition } = {
      Sightseeing: faLandmark,
      Sport: faWeightHanging,
      'Outdoor adventure': faPersonHiking,
      Cultural: faGopuram,
    };

    return iconMapping[name] || faCircle;
  }

  add(activityDate: Date, tripId: number = this.trip.tripId): void {
    let date =
      activityDate.getFullYear() +
      '-' +
      (activityDate.getMonth() + 1) +
      '-' +
      activityDate.getDate();
    this.router.navigate(['/calendar/activity'], {
      state: { tripId: tripId, date: date, mode: 'add' },
    });
  }

  handleDelete(): void {
    this.closeModal();
    this.dates.length = 0;
    this.getTripById(this.tripId);
    this.mode = 'delete';
  }

  openModal(id: number, status: String): void {
    let foundActivity = this.trip.activities.find(
      (obj) => obj.tripActivityId === id
    );

    if (foundActivity) {
      this.activity = foundActivity;
      this.modalDayStatus = status;
      this.isModalOpen = true;
    }
  }

  closeModal(): void {
    this.isModalOpen = false;
  }
}
