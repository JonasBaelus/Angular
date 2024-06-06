import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewActivityFormComponent } from './review-activity-form.component';

describe('ReviewActivityFormComponent', () => {
  let component: ReviewActivityFormComponent;
  let fixture: ComponentFixture<ReviewActivityFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewActivityFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReviewActivityFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
