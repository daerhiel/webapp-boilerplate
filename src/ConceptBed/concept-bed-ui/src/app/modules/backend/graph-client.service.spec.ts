import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { GraphClientService } from './graph-client.service';

describe('GraphClientService', () => {
  let service: GraphClientService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
      ]
    });
    service = TestBed.inject(GraphClientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
