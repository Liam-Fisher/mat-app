import { TestBed } from '@angular/core/testing';

import { PathDrawService } from './path-draw.service';

describe('PathDrawService', () => {
  let service: PathDrawService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PathDrawService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
