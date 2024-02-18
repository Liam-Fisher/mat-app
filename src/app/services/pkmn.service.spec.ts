import { TestBed } from '@angular/core/testing';

import { PkmnService } from './pkmn.service';

describe('PkmnService', () => {
  let service: PkmnService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PkmnService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
