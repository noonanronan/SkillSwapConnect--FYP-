import { TestBed } from '@angular/core/testing';

import { SimpleWebSocketService } from './simple-web-socket.service';

describe('SimpleWebSocketService', () => {
  let service: SimpleWebSocketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SimpleWebSocketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
