import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PkdxComponent } from './pkdx-table.component';

describe('PkdxComponent', () => {
  let component: PkdxComponent;
  let fixture: ComponentFixture<PkdxComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PkdxComponent]
    });
    fixture = TestBed.createComponent(PkdxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
