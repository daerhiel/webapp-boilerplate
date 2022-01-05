import { TestBed } from '@angular/core/testing';

import { ContentStateService } from './content-state.service';

describe('ContentStateService', () => {
  let service: ContentStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContentStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
