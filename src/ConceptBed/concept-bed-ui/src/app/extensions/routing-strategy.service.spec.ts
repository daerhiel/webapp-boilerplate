import { TestBed } from '@angular/core/testing';

import { RoutingStrategyService } from './routing-strategy.service';

describe('RoutingStrategyService', () => {
  let service: RoutingStrategyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RoutingStrategyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
