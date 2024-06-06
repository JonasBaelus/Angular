import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicApiTestComponent } from './public-api-test.component';

describe('PublicApiTestComponent', () => {
  let component: PublicApiTestComponent;
  let fixture: ComponentFixture<PublicApiTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicApiTestComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PublicApiTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
