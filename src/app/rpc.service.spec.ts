import { TestBed, inject } from '@angular/core/testing';

import { RPCService } from './rpc.service';

describe('RPCService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RPCService]
    });
  });

  it('should be created', inject([RPCService], (service: RPCService) => {
    expect(service).toBeTruthy();
  }));
});
