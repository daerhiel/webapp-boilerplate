import { TestBed } from '@angular/core/testing';

import { TitleResolverService } from './title-resolver.service';

describe('TitleResolverService', () => {
  let service: TitleResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TitleResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
