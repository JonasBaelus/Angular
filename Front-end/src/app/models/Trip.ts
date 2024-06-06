import { User } from '@auth0/auth0-angular';
import { Activity } from './Activity';
import { TripCategory } from './TripCategory';

export interface Trip {
  tripId: number;
  name: string;
  startDate: Date;
  endDate: Date;
  picture: string;
  description: string;
  city: string;
  country: string;
  isShared: boolean;
  activities: Activity[];
  categories: TripCategory[];
}
