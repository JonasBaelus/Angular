import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Category } from 'src/app/models/Category';
import { CategoryService } from 'src/app/services/category/category.service';
import { Subscription } from 'rxjs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-trip-filter',
  standalone: true,
  imports: [CommonModule, FormsModule, MatTooltipModule, FontAwesomeModule],
  templateUrl: './trip-filter.component.html',
  styleUrl: './trip-filter.component.css'
})
export class TripFilterComponent implements OnInit {
  @Output() searchNameChange = new EventEmitter<string>();
  @Output() categorySelected = new EventEmitter<number[]>();

  categories$: Subscription = new Subscription();

  searchName: string = '';
  isLoading: boolean = false;
  categories: Category[] = [];
  searchCategories: number[] = [];
  faCross = faXmark;

  constructor(
    private categoryService: CategoryService,
  ) {}

  ngOnInit() {
    this.getCategories();
  }

  ngOnDestroy() {
    this.categories$.unsubscribe();
  }

  onSearchNameChange(value: string) {
    this.searchName = value;
    //this.searchNameChange.emit(value);
  }

  setCategory(id: number) {
    if (this.searchCategories.includes(id)) {
      const index = this.searchCategories.indexOf(id);
      this.searchCategories.splice(index, 1);
      //this.onSelectCategory();
    } else {
      this.searchCategories.push(id);
      //this.onSelectCategory();
    }
  }

  /* onSelectCategory() {
    this.categorySelected.emit(this.searchCategories);
  } */

  getCategories() {
    this.isLoading = true;
    this.categories$ = this.categoryService
      .getPaginatedCategories()
      .subscribe((result) => {
        this.categories = result.result;
      });
  }

  isInSearchCategories(id: number) {
    if (this.searchCategories.includes(id)) {
      return true;
    } else {
      return false;
    }
  }

  submit() {
    this.searchNameChange.emit(this.searchName);
    this.categorySelected.emit(this.searchCategories);
  }
}
