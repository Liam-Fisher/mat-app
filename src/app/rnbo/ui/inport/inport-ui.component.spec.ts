import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InportUiComponent } from './inport-ui.component';

describe('InportUiComponent', () => {
  let component: InportUiComponent;
  let fixture: ComponentFixture<InportUiComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InportUiComponent]
    });
    fixture = TestBed.createComponent(InportUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
