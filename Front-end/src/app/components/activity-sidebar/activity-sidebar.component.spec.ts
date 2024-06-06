import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivitySidebarComponent } from './activity-sidebar.component';

describe('ActivitySidebarComponent', () => {
  let component: ActivitySidebarComponent;
  let fixture: ComponentFixture<ActivitySidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivitySidebarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ActivitySidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
