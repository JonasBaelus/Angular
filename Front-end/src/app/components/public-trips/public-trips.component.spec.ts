import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicTripsComponent } from './public-trips.component';

describe('PublicTripsComponent', () => {
  let component: PublicTripsComponent;
  let fixture: ComponentFixture<PublicTripsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PublicTripsComponent]
    });
    fixture = TestBed.createComponent(PublicTripsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
