import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Activity } from 'src/app/models/Activity';
import {
  IconDefinition,
  faCircle,
  faGopuram,
  faLandmark,
  faPencil,
  faPersonHiking,
  faTrash,
  faWeightHanging,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ConfirmationPopupComponent } from '../../shared/confirmation-popup/confirmation-popup.component';
import { ActivityService } from 'src/app/services/activity/activity.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { RatingComponent } from '../rating/rating.component';

@Component({
  selector: 'app-calendar-detail-modal',
  standalone: true,
  templateUrl: './calendar-detail-modal.component.html',
  styleUrl: './calendar-detail-modal.component.css',
  imports: [
    CommonModule,
    FontAwesomeModule,
    ConfirmationPopupComponent,
    RatingComponent,
  ],
})
export class CalendarDetailModalComponent implements OnDestroy {
  @Input() activity!: Activity;
  @Input() status: String = '';
  @Input() isPublic: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();

  errorMessage: String = '';

  isConfirmationOpen: boolean = false;

  deleteActivity$: Subscription = new Subscription();

  faTrash = faTrash;
  faPencil = faPencil;
  faXmark = faXmark;

  constructor(
    private activityService: ActivityService,
    private router: Router
  ) {}

  ngOnDestroy(): void {
    this.deleteActivity$.unsubscribe();
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

  @HostListener('document:keydown.escape', ['$event'])
  onEscapePressed(event: KeyboardEvent) {
    this.closeModal();
  }

  closeModal(): void {
    this.close.emit();
  }

  openConfirmationModal(): void {
    this.isConfirmationOpen = true;
  }

  closeConfirmationModal(): void {
    this.isConfirmationOpen = false;
  }

  editActivity(id: number): void {
    this.router.navigate(['calendar/activity'], {
      state: { id: id, mode: 'edit', status: this.status },
    });
  }

  deleteActivity(): void {
    this.deleteActivity$ = this.activityService
      .deleteActivity(this.activity.tripActivityId)
      .subscribe({
        next: (v) => {
          this.isConfirmationOpen = false;
          this.delete.emit();
        },
        error: (e) =>
          (this.errorMessage =
            'Something went wrong when deleting the activity.'),
      });
  }
}
