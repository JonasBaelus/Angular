import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryListComponent } from './category.component';

describe('CategoryComponent', () => {
  let component: CategoryListComponent;
  let fixture: ComponentFixture<CategoryListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CategoryListComponent]
    });
    fixture = TestBed.createComponent(CategoryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
