import { TestBed } from '@angular/core/testing';

import { UserTripService } from './user-trip.service';

describe('UserTripService', () => {
  let service: UserTripService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserTripService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
