import { TestBed } from '@angular/core/testing';

import { RnboLoaderService } from './rnbo-loader.service';

describe('RnboLoaderService', () => {
  let service: RnboLoaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RnboLoaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
