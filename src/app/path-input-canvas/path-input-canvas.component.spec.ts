import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PathInputCanvasComponent } from './path-input-canvas.component';

describe('PathInputCanvasComponent', () => {
  let component: PathInputCanvasComponent;
  let fixture: ComponentFixture<PathInputCanvasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PathInputCanvasComponent]
    });
    fixture = TestBed.createComponent(PathInputCanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
