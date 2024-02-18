import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PkdxDisplayComponent } from './pkdx-display.component';

describe('PkdxDisplayComponent', () => {
  let component: PkdxDisplayComponent;
  let fixture: ComponentFixture<PkdxDisplayComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PkdxDisplayComponent]
    });
    fixture = TestBed.createComponent(PkdxDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
