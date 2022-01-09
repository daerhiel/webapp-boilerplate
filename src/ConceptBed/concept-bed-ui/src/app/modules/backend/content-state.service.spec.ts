import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { ContentStateService } from './content-state.service';

describe('ContentStateService', () => {
  let service: ContentStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[
        HttpClientModule,
      ]
    });
    service = TestBed.inject(ContentStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
