import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Activity } from 'src/app/models/Activity';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RatingComponent } from '../rating/rating.component';

@Component({
  selector: 'app-review-activity-form',
  standalone: true,
  templateUrl: './review-activity-form.component.html',
  styleUrl: './review-activity-form.component.css',
  imports: [CommonModule, FormsModule, RatingComponent],
})
export class ReviewActivityFormComponent implements OnChanges {
  @Input() activity!: Activity;
  @Output() submit = new EventEmitter<Activity>();

  isSubmitted: boolean = false;
  rating: number = 0;

  constructor(private router: Router) {}

  ngOnChanges(): void {
    let score = this.activity.score;

    this.rating = score ? score : 0;
  }

  updateRating(value: number): void {
    this.rating = value;
  }

  resetRating(): void {
    this.rating = 0;
  }

  onSubmitValidate(): void {
    if (this.rating >= 0 && this.rating <= 5) {
      this.handleSubmit();
    }
  }

  handleSubmit(): void {
    this.isSubmitted = true;
    this.activity.score = this.rating;
    this.submit.emit(this.activity);
  }

  goToCalendar(): void {
    this.router.navigateByUrl('/calendar');
  }
}
