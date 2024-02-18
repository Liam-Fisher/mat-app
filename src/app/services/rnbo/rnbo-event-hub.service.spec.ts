import { TestBed } from '@angular/core/testing';

import { RnboEventHubService } from './rnbo-event-hub.service';

describe('RnboEventHubService', () => {
  let service: RnboEventHubService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RnboEventHubService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
