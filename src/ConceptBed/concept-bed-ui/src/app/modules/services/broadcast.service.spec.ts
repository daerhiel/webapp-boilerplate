import { TestBed } from '@angular/core/testing';

import { BroadcastService } from './broadcast.service';

describe('BroadastService', () => {
  let service: BroadcastService;

  beforeEach(async () => {
    TestBed.configureTestingModule({}).compileComponents();
    service = TestBed.inject(BroadcastService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
