import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  faArrowLeft,
  faArrowRight,
  faCheckCircle,
  faImage,
  faPerson,
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormControl, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ToastComponent } from '../../shared/toast/toast.component';
import { TripService } from '../../services/trip/trip.service';
import { NgForm } from '@angular/forms';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { UserTripService } from '../../services/user-trip/user-trip.service';
import { AuthService } from '@auth0/auth0-angular';
import { delay, of, take, timer } from 'rxjs';
import { Trip } from '../../models/Trip';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { StorageService } from 'src/app/services/storage/storage.service';
import { AutocompleteComponent } from '../autocomplete/autocomplete.component';
import { ForecastcardComponent } from '../forecastcard/forecastcard.component';
import { CategoryService } from 'src/app/services/category/category.service';
import { Category } from 'src/app/models/Category';
import { TripCategoryService } from 'src/app/services/trip-category/trip-category.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-getstarted',
  standalone: true,
  templateUrl: './getstarted.component.html',
  styleUrls: ['./getstarted.component.css'],
  imports: [
    CommonModule,
    FontAwesomeModule,
    FormsModule,
    HttpClientModule,
    ToastComponent,
    NavbarComponent,
    FooterComponent,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    AutocompleteComponent,
    ForecastcardComponent,
  ],
})
export class GetstartedComponent implements OnInit {
  @ViewChild('startDateInput') startDateInput!: ElementRef<HTMLInputElement>;
  @ViewChild('endDateInput') endDateInput!: ElementRef<HTMLInputElement>;

  categories: Category[] = [];
  form = new FormControl({});
  selectedItems: number[] = [];

  ngOnInit(): void {
    this.categoryService.getCategories().subscribe((data) => {
      this.categories = data;
    });
  }

  isSelected(categoryId: number): boolean {
    return this.selectedItems.includes(categoryId);
  }

  toggleSelection(categoryId: number): void {
    if (this.isSelected(categoryId)) {
      this.selectedItems = this.selectedItems.filter(
        (item) => item !== categoryId
      );
    } else {
      this.selectedItems.push(categoryId);
    }
  }

  faImage = faImage;
  faTrash = faTrashAlt;
  faCalendar = faCheckCircle; // Adjusted icon import
  faPerson = faPerson;
  faChecklist = faCheckCircle; // Adjusted icon import
  faUser = faPerson;
  faEnvelope = faCheckCircle; // Adjusted icon import
  faArrowRight = faArrowRight;
  faArrowLeft = faArrowLeft;
  selectedChoice: string = 'choose1';
  currentStep: number = 1;
  tripName: string = '';
  startDate: Date | null = null; // or undefined
  endDate: Date | null = null; // or undefined
  selectedFileName: string | undefined;
  imagePreviewUrl: string | undefined;
  isShared: boolean | null = null;
  tripDescription: string = '';
  tripCountry: string = '';
  tripCity: string = '';
  selectedCity: string = '';
  wrongFormat: boolean = false;
  selectedLocation: string = '';
  isSubmitted: boolean = false;
  isError: boolean = false;

  tripFormSubmitted = false; // Flag to track form submission
  tripFormSubmitted2 = false; // Flag to track form submission

  fileInput: HTMLInputElement | null = null;
  file: File | undefined;
  imageUrl: string | undefined;

  toggleDropdown() {
    const dropdown = document.getElementById('dropdown-menu-items');
    dropdown?.classList.toggle('hidden');
  }

  @ViewChild('tripForm') tripForm!: NgForm;
  @ViewChild('tripForm2') tripForm2!: NgForm;

  constructor(
    private tripService: TripService,
    private userTripService: UserTripService,
    public _auth: AuthService,
    private storageService: StorageService,
    private categoryService: CategoryService,
    private tripCategoryService: TripCategoryService,
    private router: Router
  ) {}

  nextStep(): void {
    if (this.currentStep === 2) {
      this.tripFormSubmitted2 = true;
      if (this.tripForm2 && this.tripForm2.form.valid) {
        this.currentStep++;
      }
    }
    if (this.currentStep === 1) {
      this.tripFormSubmitted = true;
      if (this.tripForm && this.tripForm.form.valid) {
        this.currentStep++;
      }
    }
  }

  prevStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  async postNewTrip(loggedInUser: any): Promise<Trip> {
    let newStartDate = new Date(
      this.startDate!.getFullYear(),
      this.startDate!.getMonth(),
      this.startDate!.getDate(),
      new Date().getHours(),
      new Date().getMinutes(),
      new Date().getSeconds()
    );
    let newEndDate = new Date(
      this.endDate!.getFullYear(),
      this.endDate!.getMonth(),
      this.endDate!.getDate(),
      new Date().getHours(),
      new Date().getMinutes(),
      new Date().getSeconds()
    );

    let trip = await this.tripService
      .postTrip({
        tripId: 0,
        name: this.tripName,
        startDate: newStartDate,
        endDate: newEndDate,
        picture: this.imageUrl!,
        description: this.tripDescription,
        isShared: this.isShared!,
        city: this.tripCity,
        country: this.tripCountry,
        activities: [],
        categories: [],
      })
      .toPromise();

    if (!trip) {
      throw new Error('Trip creation failed or returned undefined.'); // Handle undefined case
    }

    return trip;
  }

  async postNewUserTrip(tripId: number, userId: string) {
    this.userTripService
      .postUserTrip({
        tripId: tripId,
        userId: userId,
      })
      .toPromise();
  }

  async postNewTripCategory(tripId: number, categoryIds: number[]) {
    for (let categoryId of categoryIds) {
      try {
        this.categoryService
          .getCategoryById(categoryId)
          .subscribe((category) => {
            this.tripCategoryService
              .postTripCategory({
                tripId: tripId,
                categoryId: categoryId,
                category: category,
              })
              .toPromise();
          });
      } catch (error) {
        console.error(
          `Error while making POST request for categoryId ${categoryId}:`,
          error
        );
      }
    }
  }

  async checkUserLoggedIn(): Promise<any> {
    let loggedInUser: any;

    if (this._auth.user$) {
      await this._auth.user$
        .pipe(take(1))
        .toPromise()
        .then((data) => {
          loggedInUser = data;
        });
    }

    return loggedInUser;
  }

  async submit() {
    try {
      let loggedInUser = await this.checkUserLoggedIn();

      if (loggedInUser !== null) {
        await this.uploadImage();

        let trip = await this.postNewTrip(loggedInUser);

        await this.postNewUserTrip(trip.tripId, loggedInUser.sub);
        await this.postNewTripCategory(trip.tripId, this.selectedItems);

        this.isSubmitted = true;
        // Redirect after 2 seconds using rxjs delay operator
        of(null)
          .pipe(delay(2000))
          .subscribe(() => {
            this.router.navigate(['/trips']);
          });
      } else {
        this._auth.loginWithPopup();
      }
    } catch (error) {
      this.isError = true;
    }
  }

  validateFileType(event: any): void {
    const allowedFileTypes = ['.svg', '.png', '.jpg'];
    const input = event.target;

    if (input.files && input.files.length > 0) {
      const fileName = input.files[0].name;
      const fileExtension = fileName.slice(
        ((fileName.lastIndexOf('.') - 1) >>> 0) + 2
      );

      if (allowedFileTypes.includes(`.${fileExtension.toLowerCase()}`)) {
        // Valid file type, you can proceed with your logic here
        this.updateFileName(event);
      } else {
        this.wrongFormat = true;
        input.value = '';

        timer(5000)
          .pipe(take(1))
          .subscribe(() => {
            this.wrongFormat = false;
          });
      }
    }
  }

  async uploadImage(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (this.file) {
        const path = 'assets/' + this.file.name;

        // Upload image
        this.storageService.uploadImage(this.file, path).subscribe(
          (url) => {
            this.imageUrl = url;
            resolve(); // Resolve the promise when image upload is complete, even if imageUrl is undefined
          },
          (error) => {
            console.error('Error uploading image', error);
            reject(error); // Reject the promise if there's an error during upload
          }
        );
      } else {
        // No file selected, resolve the promise without setting imageUrl
        resolve();
      }
    });
  }

  isPrevButtonDisabled(): boolean {
    return this.currentStep === 1;
  }

  selectChoose(choice: string) {
    this.selectedChoice = choice;
  }

  updateFileName(event: any): void {
    this.fileInput = event.target;
    this.file = this.fileInput?.files?.[0];

    if (this.file) {
      this.selectedFileName = this.file.name;

      // Create a FileReader
      const reader = new FileReader();

      // Set up the FileReader to handle the file's data
      reader.onload = (e: any) => {
        // e.target.result contains the data URL representing the image
        this.imagePreviewUrl = e.target.result;
      };

      // Read the file as a data URL
      reader.readAsDataURL(this.file);
    }
  }

  removeImage(): void {
    this.selectedFileName = undefined;
    this.imagePreviewUrl = undefined;
  }

  selectSharingOption(isShared: boolean): void {
    this.isShared = isShared;
  }

  handleCitySelection(city: any) {
    this.tripCountry = city.country;
    this.tripCity = city.name;
    this.selectedCity = city.name;
    if (city.adminName) {
      this.selectedLocation = `${city.name}, ${city.country} (${city.adminName})`;
    } else {
      this.selectedLocation = `${city.name}, ${city.country}`;
    }
  }
}
