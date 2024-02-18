import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PkmnViewComponent } from './pkmn-view.component';

describe('PkmnViewComponent', () => {
  let component: PkmnViewComponent;
  let fixture: ComponentFixture<PkmnViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PkmnViewComponent]
    });
    fixture = TestBed.createComponent(PkmnViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
