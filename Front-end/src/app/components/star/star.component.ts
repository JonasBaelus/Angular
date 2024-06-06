import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-star',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './star.component.html',
  styleUrl: './star.component.css',
})
export class StarComponent {
  @Input() filled: boolean = false;
  @Input() isEdit: boolean = true;
  @Output() starClicked = new EventEmitter<number>();
  @Output() starHovered = new EventEmitter<number>();

  onStarClick(): void {
    if (this.isEdit) {
      this.starClicked.emit();
    }
  }

  onHover(): void {
    if (this.isEdit) {
      this.starHovered.emit();
    }
  }
}
