import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Trip } from 'src/app/models/Trip';
import { faCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-activity-sidebar',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, FormsModule],
  templateUrl: './activity-sidebar.component.html',
  styleUrl: './activity-sidebar.component.css',
})
export class ActivitySidebarComponent implements OnChanges {
  @Input() trip!: Trip | undefined;

  datesWithActivities: string[] = [];
  faCircle = faCircle;

  constructor(private datePipe: DatePipe) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['trip']) {
      this.showActivities();
    }
  }

  showActivities() {
    this.datesWithActivities = [];
    this.trip!.activities.forEach((activity) => {
      const formattedDate = this.datePipe.transform(
        activity.startDate,
        'yyyy-MM-dd'
      );
      this.datesWithActivities.push(formattedDate!);
      this.datesWithActivities = Array.from(new Set(this.datesWithActivities)); //remove duplicates
    });
    this.datesWithActivities.sort((a, b) => {
      const dateA = new Date(a);
      dateA.setHours(0, 0, 0, 0);
      const dateB = new Date(b);
      dateB.setHours(0, 0, 0, 0);

      if (dateA < dateB) {
        return -1;
      } else if (dateA > dateB) {
        return 1;
      } else {
        return 0;
      }
    });
  }
}
