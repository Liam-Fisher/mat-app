import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParameterUIComponent } from './parameter-ui.component';

describe('ParameterUIComponent', () => {
  let component: ParameterUIComponent;
  let fixture: ComponentFixture<ParameterUIComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ParameterUIComponent]
    });
    fixture = TestBed.createComponent(ParameterUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
