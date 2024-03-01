import { TestBed } from '@angular/core/testing';

import { BackendAPIsService } from './backend-apis.service';

describe('BackendAPIsService', () => {
  let service: BackendAPIsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BackendAPIsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
