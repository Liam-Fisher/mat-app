import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PkdxSelectionComponent } from './pkdx-selection.component';

describe('PkdxSelectionComponent', () => {
  let component: PkdxSelectionComponent;
  let fixture: ComponentFixture<PkdxSelectionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PkdxSelectionComponent]
    });
    fixture = TestBed.createComponent(PkdxSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
