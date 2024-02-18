import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RnboDeviceComponent } from './rnbo-device.component';

describe('RnboDeviceComponent', () => {
  let component: RnboDeviceComponent;
  let fixture: ComponentFixture<RnboDeviceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RnboDeviceComponent]
    });
    fixture = TestBed.createComponent(RnboDeviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
