import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Trip } from 'src/app/models/Trip';
import { Router } from '@angular/router';
import { TripService } from 'src/app/services/trip/trip.service';

@Component({
  selector: 'app-public-trip-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './public-trip-card.component.html',
  styleUrl: './public-trip-card.component.css'
})
export class PublicTripCardComponent {
  @Input() trip!: Trip;

  @Output() selectedTrip = new EventEmitter<Trip>();

  datesWithActivities: string[] = [];

  constructor(
    private tripService: TripService,
    private router: Router,
  ) {}

  showActivities(trip: Trip) {
      this.selectedTrip.emit(trip);
  }

  navigateToTrip(tripId: number) {
    this.tripService.setTripId(tripId);
    this.router.navigate(['/calendar'], { state: { isPublic: 'true' } });
  }
}
