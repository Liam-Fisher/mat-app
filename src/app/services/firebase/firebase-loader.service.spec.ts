import { TestBed } from '@angular/core/testing';

import { FirebaseLoaderService } from './firebase-loader.service';

describe('FirebaseLoaderService', () => {
  let service: FirebaseLoaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FirebaseLoaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
