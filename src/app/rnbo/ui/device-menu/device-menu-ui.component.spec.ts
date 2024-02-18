import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SourceDeviceSelectionMenuComponent } from './device-menu-ui.component';

describe('SourceDeviceSelectionMenuComponent', () => {
  let component: SourceDeviceSelectionMenuComponent;
  let fixture: ComponentFixture<SourceDeviceSelectionMenuComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SourceDeviceSelectionMenuComponent]
    });
    fixture = TestBed.createComponent(SourceDeviceSelectionMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
