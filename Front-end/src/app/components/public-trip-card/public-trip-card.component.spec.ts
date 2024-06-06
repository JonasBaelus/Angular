import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicTripCardComponent } from './public-trip-card.component';

describe('PublicTripCardComponent', () => {
  let component: PublicTripCardComponent;
  let fixture: ComponentFixture<PublicTripCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicTripCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PublicTripCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
