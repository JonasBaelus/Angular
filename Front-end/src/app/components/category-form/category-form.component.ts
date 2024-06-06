import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Category } from 'src/app/models/Category';
import { CategoryService } from 'src/app/services/category/category.service';
import { Subscription, delay } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.css'],
})
export class CategoryFormComponent implements OnInit, OnDestroy {
  @Output() closeModal: EventEmitter<void> = new EventEmitter<void>();
  @Output() categoryUpdated: EventEmitter<void> = new EventEmitter<void>();
  @Input() mode!: string;
  @Input() categoryId: number | undefined;

  isAdd: boolean = false;
  isEdit: boolean = false;

  category: Category = { categoryId: 0, name: '', description: '' };

  isSubmitted: boolean = false;
  errorMessage: string = '';

  category$: Subscription = new Subscription();
  postCategory$: Subscription = new Subscription();
  putCategory$: Subscription = new Subscription();

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    if (this.mode === 'add') {
      this.isAdd = true;
    } else if (this.mode === 'edit') {
      this.isEdit = true;
    }

    if (this.isEdit && this.categoryId) {
      this.category$ = this.categoryService
        .getCategoryById(this.categoryId)
        .subscribe((result) => {
          this.category = result;
        });
    }
  }

  ngOnDestroy(): void {
    this.category$.unsubscribe();
    this.postCategory$.unsubscribe();
    this.putCategory$.unsubscribe();
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.isAdd) {
      this.postCategory$ = this.categoryService
        .postCategory(this.category)
        .pipe(delay(1000)) // Adjust the delay time as needed
        .subscribe({
          error: (e) => (this.errorMessage = e.message),
          complete: () => this.sendEmitters(),
        });
    }
    if (this.isEdit) {
      this.putCategory$ = this.categoryService
        .putCategory(this.categoryId!, this.category)
        .pipe(delay(1000)) // Adjust the delay time as needed
        .subscribe({
          error: (e) => (this.errorMessage = e.message),
          complete: () => this.sendEmitters(),
        });
    }
  }

  // Function to fetch updated categories
  sendEmitters() {
    this.categoryUpdated.emit();
    this.goBack();
  }

  goBack() {
    this.closeModal.emit();
  }
}
