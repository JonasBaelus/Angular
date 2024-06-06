import { TestBed } from '@angular/core/testing';

import { TripCategoryService } from './trip-category.service';

describe('TripCategoryService', () => {
  let service: TripCategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TripCategoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
