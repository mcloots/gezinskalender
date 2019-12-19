import { TestBed } from '@angular/core/testing';

import { GezinService } from './gezin.service';

describe('GezinService', () => {
  let service: GezinService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GezinService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
