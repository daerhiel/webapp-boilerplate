import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { ContentApiService } from './content-api.service';

describe('ContentApiService', () => {
  let service: ContentApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
      ]
    });
    service = TestBed.inject(ContentApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
