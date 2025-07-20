import { TestBed } from '@angular/core/testing';

import { RPCService } from './rpc';

describe('Rpc', () => {
  let service: RPCService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RPCService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
