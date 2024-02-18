import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PkmnTeamComponent } from './pkmn-team.component';

describe('PkmnTeamComponent', () => {
  let component: PkmnTeamComponent;
  let fixture: ComponentFixture<PkmnTeamComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PkmnTeamComponent]
    });
    fixture = TestBed.createComponent(PkmnTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
