import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditActivityFormComponent } from './add-edit-activity-form.component';

describe('AddEditActivityFormComponent', () => {
  let component: AddEditActivityFormComponent;
  let fixture: ComponentFixture<AddEditActivityFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditActivityFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddEditActivityFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
