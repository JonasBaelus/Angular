import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  faEllipsis,
  faPencil,
  faPencilAlt,
  faPlus,
  faShare,
  faTrash,
  faUsers,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Router, RouterModule } from '@angular/router';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { UserTripService } from 'src/app/services/user-trip/user-trip.service';
import { AuthService, User } from '@auth0/auth0-angular';
import { TripService } from 'src/app/services/trip/trip.service';
import { ToastComponent } from '../../shared/toast/toast.component';
import { PageLoaderComponent } from '../../shared/page-loader/page-loader.component';
import { environment } from 'src/environments/environment';
import { ClipboardService } from 'ngx-clipboard';
import {
  Observable,
  forkJoin,
  map,
  of,
  startWith,
  switchMap,
  take,
  timer,
} from 'rxjs';
import {
  NgForm,
  FormsModule,
  FormControl,
  FormGroup,
  FormBuilder,
} from '@angular/forms';
import { Trip } from 'src/app/models/Trip';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { UserService } from 'src/app/services/user/user.service';
import { List } from 'postcss/lib/list';
import { EmailService } from 'src/app/services/email/email.service';

@Component({
  selector: 'app-trip',
  standalone: true,
  templateUrl: './trip.component.html',
  styleUrls: ['./trip.component.css'],
  imports: [
    CommonModule,
    RouterModule,
    FontAwesomeModule,
    NavbarComponent,
    FooterComponent,
    ToastComponent,
    PageLoaderComponent,
    FormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
  ],
})
export class TripComponent implements OnInit {
  @ViewChild('tripForm') tripForm!: NgForm;

  faPlus = faPlus;
  faTrash = faTrash;
  faPencil = faPencilAlt;
  faShare = faShare;
  faEllipsis = faEllipsis;
  faUsers = faUsers;

  public loggedInUser: any;
  userId: string = '';
  tripId: number = 0;
  isError: boolean = false;
  warning: boolean = false;
  share: boolean = false;
  edit: boolean = false;
  isDeleted: boolean = false;
  isUpdated: boolean = false;
  isLoading = false;
  isCopied = false;
  isShared: boolean = false;
  startDate: Date | null = null; // or undefined
  endDate: Date | null = null; // or undefined
  users: User[] = [];
  filteredUsers: User[] = [];
  searchTerm: string = '';
  allTripsFromUser: any[] = [];
  isSend: boolean = false;

  tripName: string = '';
  tripFormSubmitted = false; // Flag to track form submission
  tripUpdate: Trip = {
    tripId: 0,
    name: '',
    startDate: new Date(),
    endDate: new Date(),
    picture: '',
    description: '',
    country: '',
    city: '',
    isShared: false,
    activities: [],
    categories: [],
  }; // Holds the form data

  constructor(
    private tripService: TripService,
    private userTripService: UserTripService,
    public authService: AuthService,
    private router: Router,
    private userService: UserService,
    private emailService: EmailService
  ) {}

  tripContributors: User[] = [];

  async ngOnInit(): Promise<void> {
    try {
      this.isLoading = true;
      await this.fetchUsers();
      await this.fetchLoggedInUser();
    } catch (error) {
      console.error('Error during initialization:', error);
    } finally {
      this.isLoading = false;
    }
  }

  private async fetchUsers(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.userService.getUsers().subscribe(
        (data) => {
          this.users = data;
          resolve();
        },
        (error) => {
          console.error('Error fetching users:', error);
          reject(error);
        }
      );
    });
  }

  private async fetchLoggedInUser(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.authService.user$) {
        this.authService.user$.pipe(take(1)).subscribe(
          (data) => {
            this.loggedInUser = data;
            this.fetchTripsFromUser(this.loggedInUser.sub);
            this.userId = data?.sub || '';
            resolve();
          },
          (error) => {
            console.error('Error fetching logged-in user:', error);
            reject(error);
          }
        );
      }
    });
  }

  sendEmail(user: User): void {
    if (user.email == undefined || user['user_id'] == undefined) {
      this.isError = true;
    } else {
      this.emailService
        .sendEmail(user.email, user['user_id'], this.tripId)
        .subscribe((success) => {
          if (success) {
            // Handle success
            this.isSend = true;
            this.searchTerm = '';
            this.filteredUsers = [];

            timer(5000)
              .pipe(take(1))
              .subscribe(() => {
                this.isSend = false;
              });
          } else {
            // Handle failure
            this.isError = true;
          }
        });
    }
  }

  updateFilter(event: any): void {
    if (event.target.value === '') {
      this.filteredUsers = [];
    } else {
      this.userTripService.getUserTrips().subscribe((userTrips) => {
        const contributors = userTrips.filter(
          (userTrip) => userTrip.tripId === this.tripId
        );

        // Extract unique userId values from contributors
        const uniqueUserIds = Array.from(
          new Set(contributors.map((userTrip) => userTrip.userId))
        );

        // Filter users based on name and exclude contributors
        this.filteredUsers = this.users.filter(
          (user) =>
            user.email!.toLowerCase() === event.target.value &&
            !uniqueUserIds.includes(user['user_id'])
        );
      });
    }
  }

  fetchTripsFromUser(userId: string): void {
    this.userTripService.getTripsByUserId(userId).subscribe((trips) => {
      this.allTripsFromUser = trips;

      // Fetch contributors for each trip
      for (const trip of this.allTripsFromUser) {
        this.fetchContributors(trip.tripId);
      }
    });
  }

  contributors: any[] = [];
  contributorsMap: { [tripId: number]: User[] } = {};

  fetchContributors(tripId: number): void {
    this.userTripService.getUserTrips().subscribe((userTrips) => {
      const contributors = userTrips.filter(
        (userTrip) => userTrip.tripId === tripId
      );

      const uniqueUserIds = Array.from(
        new Set(contributors.map((userTrip) => userTrip.userId))
      );

      const filteredUsers = this.users.filter((user) =>
        uniqueUserIds.includes(user['user_id'])
      );

      // Store the result in the map
      this.contributorsMap[tripId] = filteredUsers;
    });
  }

  showModal(tripId: number): void {
    this.warning = true;
    this.tripId = tripId;
  }

  shareModal(tripId: number): void {
    this.share = true;
    this.tripId = tripId;

    // this.fetchContributors(this.tripId);
  }

  hideModal(): void {
    this.warning = false;
    this.share = false;
    this.edit = false;
    this.searchTerm = '';
    this.filteredUsers = [];
  }

  deleteTrip(): void {
    this.isLoading = true;
    this.tripService.deleteTrip(this.tripId).subscribe(
      () => {
        this.deleteUserTrip(this.userId, this.tripId);
        this.fetchTripsFromUser(this.userId);
        this.isDeleted = true;
        this.isLoading = false;

        timer(5000)
          .pipe(take(1))
          .subscribe(() => {
            this.isDeleted = false;
          });
      },
      () => {
        this.isError = true;
      }
    );
    this.warning = false;
  }

  editModal(tripId: number): void {
    let trip = this.allTripsFromUser.find(
      (trip: any) => trip.tripId === tripId
    );

    this.tripUpdate = trip;
    this.tripName = this.tripUpdate.name;
    this.startDate = this.tripUpdate.startDate;
    this.endDate = this.tripUpdate.endDate;
    this.isShared = this.tripUpdate.isShared;
    this.edit = true;
    this.tripId = tripId;
  }

  updateTrip(): void {
    this.tripFormSubmitted = true;
    if (this.tripForm && this.tripForm.form.valid) {
      this.startDate = new Date(this.tripForm.controls['start'].value);
      this.endDate = new Date(this.tripForm.controls['end'].value);

      let newStartDate = new Date(
        this.startDate.getFullYear(),
        this.startDate.getMonth(),
        this.startDate.getDate(),
        new Date().getHours(),
        new Date().getMinutes(),
        new Date().getSeconds()
      );
      let newEndDate = new Date(
        this.endDate.getFullYear(),
        this.endDate.getMonth(),
        this.endDate.getDate(),
        new Date().getHours(),
        new Date().getMinutes(),
        new Date().getSeconds()
      );

      this.tripUpdate.name = this.tripName;
      this.tripUpdate.startDate = newStartDate;
      this.tripUpdate.endDate = newEndDate;
      this.tripUpdate.isShared = this.isShared;

      this.tripService
        .updateTrip(this.tripUpdate.tripId, this.tripUpdate)
        .subscribe(() => {
          this.fetchTripsFromUser(this.userId);
        });

      this.edit = false;
      this.isUpdated = true;

      timer(5000)
        .pipe(take(1))
        .subscribe(() => {
          this.isUpdated = false;
        });
    }
  }

  deleteUserTrip(userId: string, tripId: number) {
    this.userTripService.deleteUserTrip(userId, tripId);
  }

  navigateToTrip(tripId: number) {
    this.tripService.setTripId(tripId);
    this.router.navigateByUrl('/calendar');
  }
}
