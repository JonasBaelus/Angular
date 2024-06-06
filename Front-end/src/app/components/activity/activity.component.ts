import { ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ActivityType } from 'src/app/models/ActivityType';
import { ActivityTypeService } from 'src/app/services/activity-type/activity-type.service';
import { Subscription, of } from 'rxjs';
import { PageLoaderComponent } from '../../shared/page-loader/page-loader.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

import { ActivityFormComponent } from '../activity-form/activity-form.component';
import { ToastComponent } from '../../shared/toast/toast.component';
import { ConfirmationPopupComponent } from 'src/app/shared/confirmation-popup/confirmation-popup.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { PaginatedResult } from 'src/app/models/Pagination';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';
import { FilterComponent } from '../filter/filter.component';

@Component({
  selector: 'app-activity-list',
  standalone: true,
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.css'],
  imports: [
    CommonModule,
    PageLoaderComponent,
    FontAwesomeModule,
    ActivityFormComponent,
    ToastComponent,
    SidebarComponent,
    NgxPaginationModule,
    FormsModule,
    FilterComponent,
    ConfirmationPopupComponent
  ],
})
export class ActivityListComponent implements OnInit, OnDestroy {
  @Output() delete = new EventEmitter<void>();
  activities: ActivityType[] = [];
  activities$: Subscription = new Subscription();
  deleteActivity$: Subscription = new Subscription();

  errorMessage: string = '';
  isLoading: boolean = true;
  faChevron = faChevronDown;

  currentSort: string = 'id';
  isModalOpen: boolean = false;
  mode: string = 'add';
  activityId: number = 0;
  isSubmitted: boolean = false;
  isConfirmationOpen: boolean = false;
  selected: any;

  searchName: string = '';
  config: any;
  pageSizes: number[] = [2, 4, 6, 8, 10];
  selectedPageSize: number = 4;

  constructor(
    private activitTypeService: ActivityTypeService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getActivities();
    this.config = {
      itemsPerPage: this.selectedPageSize,
      currentPage: 1,
      totalItems: 5,
    };
  }

  ngOnDestroy(): void {
    this.activities$.unsubscribe();
    this.deleteActivity$.unsubscribe();
  }

  openConfirmationModal(id:number): void {
    this.isConfirmationOpen = true;
    this.selected = id
  }

  closeConfirmationModal(): void {
    this.isConfirmationOpen = false;
  }

  deleteActivity() {
    this.deleteActivity$ = this.activitTypeService.deleteActivityType(this.selected).subscribe({
      next: (v) => {
        // Delete was successful, update activities and set mode to 'delete'
        this.getActivities();
        this.isConfirmationOpen = false;
        this.mode = 'delete';
      },
      error: (e) => {
        // Handle error if deletion fails
        this.errorMessage = e.message;
      },
    });
  }

  getActivities(pageNumber: number = 1) {
    this.isLoading = true;
    this.activities$ = this.activitTypeService
      .getPaginatedActivityTypes(
        this.searchName.trim(),
        pageNumber,
        this.selectedPageSize
      )
      .subscribe(
        (response: PaginatedResult<ActivityType[]>) => {
          this.activities = response.result;
          this.config = {
            itemsPerPage: this.selectedPageSize,
            currentPage: response.pagination.CurrentPage,
            totalItems: response.pagination.TotalItems,
          };
          this.isLoading = false;
        },
        (error) => {
          return of(null);
        }
      );
  }

  sort(filter: string) {
    if (filter !== this.currentSort) {
      this.currentSort = filter;
    }
    if (filter == 'name') {
      this.activities = this.activities.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
    } else {
      this.activities = this.activities.sort();
    }
    this.isLoading = false;
  }

  openModal(mode: string, id: number) {
    this.isSubmitted = false;
    this.mode = mode;
    if (id !== 0) {
      this.activityId = id;
    }
    this.isModalOpen = true;
  }

  onUpdateOrCreate() {
    this.isSubmitted = true;
    this.getActivities();
  }

  pageChanged(event: number) {
    this.getActivities(event);
  }

  submit(search?: string) {
    if (search !== undefined) {
      this.searchName = search;
    }

    this.getActivities();
  }

  changePageSize(event: number) {
    this.selectedPageSize = event;
    this.getActivities();
  }
}
