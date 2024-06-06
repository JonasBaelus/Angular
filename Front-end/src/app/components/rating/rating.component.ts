import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StarComponent } from '../star/star.component';

@Component({
  selector: 'app-rating',
  standalone: true,
  templateUrl: './rating.component.html',
  styleUrl: './rating.component.css',
  imports: [CommonModule, StarComponent],
})
export class RatingComponent {
  @Input() filledStars: number = 0;
  @Input() isEdit: boolean = true;
  @Output() filledStarsChange = new EventEmitter<number>();
  @Output() starClicked = new EventEmitter<number>();

  rate(starIndex: number): void {
    this.filledStars = starIndex;
    this.starClicked.emit(this.filledStars);
  }

  hover(starIndex: number): void {
    if (this.isEdit) {
      this.filledStars = starIndex;
      this.filledStarsChange.emit(this.filledStars);
    }
  }
}
