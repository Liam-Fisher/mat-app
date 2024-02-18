import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PkmnRnboComponent } from './pkmn-rnbo.component';

describe('PkmnRnboComponent', () => {
  let component: PkmnRnboComponent;
  let fixture: ComponentFixture<PkmnRnboComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PkmnRnboComponent]
    });
    fixture = TestBed.createComponent(PkmnRnboComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
