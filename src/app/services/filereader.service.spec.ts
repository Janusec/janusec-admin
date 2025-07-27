import { TestBed } from '@angular/core/testing';

import { FilereaderService } from './filereader.service';

describe('FilereaderService', () => {
  let service: FilereaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FilereaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
