import { TestBed } from '@angular/core/testing';

import { PunchService } from './punch.service';

describe('PunchService', () => {
  let service: PunchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PunchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
