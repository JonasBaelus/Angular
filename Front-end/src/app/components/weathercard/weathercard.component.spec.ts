import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeathercardComponent } from './weathercard.component';

describe('WeathercardComponent', () => {
  let component: WeathercardComponent;
  let fixture: ComponentFixture<WeathercardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeathercardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WeathercardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
