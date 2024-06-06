import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityListComponent } from './activity.component';

describe('ActivityComponent', () => {
  let component: ActivityListComponent;
  let fixture: ComponentFixture<ActivityListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ActivityListComponent]
    });
    fixture = TestBed.createComponent(ActivityListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
