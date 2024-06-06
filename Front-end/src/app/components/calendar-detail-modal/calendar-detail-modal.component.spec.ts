import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarDetailModalComponent } from './calendar-detail-modal.component';

describe('CalendarDetailModalComponent', () => {
  let component: CalendarDetailModalComponent;
  let fixture: ComponentFixture<CalendarDetailModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarDetailModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CalendarDetailModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
