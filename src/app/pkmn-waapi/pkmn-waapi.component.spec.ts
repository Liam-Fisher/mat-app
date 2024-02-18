import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PkmnWaapiComponent } from './pkmn-waapi.component';

describe('PkmnWaapiComponent', () => {
  let component: PkmnWaapiComponent;
  let fixture: ComponentFixture<PkmnWaapiComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PkmnWaapiComponent]
    });
    fixture = TestBed.createComponent(PkmnWaapiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
