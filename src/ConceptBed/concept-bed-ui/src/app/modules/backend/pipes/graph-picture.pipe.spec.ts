import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';

import { GraphClientService } from '../graph-client.service';
import { GraphPicturePipe } from './graph-picture.pipe';

describe('GraphPicturePipe', () => {
  let graph: GraphClientService;
  let sanitizer: DomSanitizer;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
      ]
    });
    graph = TestBed.inject(GraphClientService);
    sanitizer = TestBed.inject(DomSanitizer);
  });

  it('create an instance', () => {
    const pipe = new GraphPicturePipe(graph, sanitizer);
    expect(pipe).toBeTruthy();
  });
});
