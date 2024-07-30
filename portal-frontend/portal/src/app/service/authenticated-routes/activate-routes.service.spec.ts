import { TestBed } from '@angular/core/testing';

import { ActivateRoutesService } from './activate-routes.service';

describe('ActivateRoutesService', () => {
  let service: ActivateRoutesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActivateRoutesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
