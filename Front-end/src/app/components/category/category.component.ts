import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Category } from 'src/app/models/Category';
import { CategoryService } from 'src/app/services/category/category.service';
import { Subscription, of } from 'rxjs';
import { PageLoaderComponent } from '../../shared/page-loader/page-loader.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

import { CategoryFormComponent } from '../category-form/category-form.component';
import { ToastComponent } from '../../shared/toast/toast.component';
import { ConfirmationPopupComponent } from 'src/app/shared/confirmation-popup/confirmation-popup.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { FilterComponent } from '../filter/filter.component';
import { PaginatedResult } from 'src/app/models/Pagination';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-category-list',
  standalone: true,
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css'],
  imports: [
    CommonModule,
    PageLoaderComponent,
    FontAwesomeModule,
    CategoryFormComponent,
    ToastComponent,
    SidebarComponent,
    FilterComponent,
    NgxPaginationModule,
    FormsModule,
    ConfirmationPopupComponent
  ],
})
export class CategoryListComponent implements OnInit, OnDestroy {
  categories: Category[] = [];
  categories$: Subscription = new Subscription();
  deleteCategory$: Subscription = new Subscription();

  errorMessage: string = '';
  isLoading: boolean = true;
  faChevron = faChevronDown;

  currentSort: string = 'id';
  isModalOpen: boolean = false;
  mode: string = 'add';
  categoryId: number = 0;
  isSubmitted: boolean = false;
  isConfirmationOpen: boolean = false;
  selected: any;

  searchName: string = '';
  config: any;
  pageSizes: number[] = [2, 4, 6, 8, 10];
  selectedPageSize: number = 4;

  constructor(
    private categoryService: CategoryService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getCategories();
    this.config = {
      itemsPerPage: this.selectedPageSize,
      currentPage: 1,
      totalItems: 5,
    };
  }

  ngOnDestroy(): void {
    this.categories$.unsubscribe();
    this.deleteCategory$.unsubscribe();
  }

  openConfirmationModal(id:number): void {
    this.isConfirmationOpen = true;
    this.selected = id
  }

  closeConfirmationModal(): void {
    this.isConfirmationOpen = false;
  }

  deleteCategory() {
    this.deleteCategory$ = this.categoryService.deleteCategory(this.selected).subscribe({
      next: (v) => this.getCategories(),
      error: (e) => (this.errorMessage = e.message),
    });
    this.isConfirmationOpen = false;
    this.mode = 'delete';
  }

  getCategories(pageNumber: number = 1) {
    this.isLoading = true;
    this.categories$ = this.categoryService
      .getPaginatedCategories(
        this.searchName.trim(),
        pageNumber,
        this.selectedPageSize
      )
      .subscribe(
        (response: PaginatedResult<Category[]>) => {
          this.categories = response.result;
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
      this.categories = this.categories.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
    } else if (filter == 'description') {
      this.categories = this.categories.sort((a, b) =>
        a.description.localeCompare(b.description)
      );
    } else {
      this.categories = this.categories.sort();
    }
    this.isLoading = false;
  }

  openModal(mode: string, id: number) {
    this.isSubmitted = false;
    this.mode = mode;
    if (id !== 0) {
      this.categoryId = id;
    }
    this.isModalOpen = true;
  }

  onUpdateOrCreate() {
    this.isSubmitted = true;
    this.getCategories();
  }

  pageChanged(event: number) {
    this.getCategories(event);
  }

  submit(search?: string) {
    if (search !== undefined) {
      this.searchName = search;
    }

    this.getCategories();
  }

  changePageSize(event: number) {
    this.selectedPageSize = event;
    this.getCategories();
  }
}
