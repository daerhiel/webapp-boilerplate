import { TestBed } from '@angular/core/testing';

import { GraphClientService } from './graph-client.service';

describe('GraphClientService', () => {
  let service: GraphClientService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GraphClientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
