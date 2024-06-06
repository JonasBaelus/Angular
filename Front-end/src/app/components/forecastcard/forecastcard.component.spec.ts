import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForecastcardComponent } from './forecastcard.component';

describe('ForecastcardComponent', () => {
  let component: ForecastcardComponent;
  let fixture: ComponentFixture<ForecastcardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForecastcardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ForecastcardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
