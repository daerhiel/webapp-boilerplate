import { inject, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { lastValueFrom } from 'rxjs';

import { environment } from '@environments/environment';
import { GraphClientService } from '../graph-client.service';
import { GraphPicturePipe } from './graph-picture.pipe';
import { UrlUtilities } from '../structure/url-utilities';

describe('GraphPicturePipe', () => {
  let controller: HttpTestingController;
  const tenantId = '00000000-1234-5678-90ab-abcdef012345';
  const localAccountId = 'abcdef01-1234-5678-90ab-abcdef012345';
  const username = 'user.name@microsoft.com';
  const account = {
    homeAccountId: '00000000-0000-0000-c41c-d9a99aaa6fe4.9188040d-6c67-4c5b-b112-36a304b66dad',
    environment: 'login.windows.net', tenantId, username, localAccountId, name: 'User Name'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],
      providers: []
    }).compileComponents();
    controller = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    controller.verify();
  });

  it('create an instance', inject([GraphClientService, DomSanitizer], async (graph: GraphClientService, sanitizer: DomSanitizer) => {
    const pipe = new GraphPicturePipe(graph, sanitizer);
    expect(pipe).toBeTruthy();
  }));

  it('transforms account info into a picture', inject([GraphClientService, DomSanitizer], async (graph: GraphClientService, sanitizer: DomSanitizer) => {
    const pipe = new GraphPicturePipe(graph, sanitizer);
    const promise = lastValueFrom(pipe.transform(account));
    const picture = new Blob(['picture'], { type: 'image/png' });

    const request = controller.expectOne(UrlUtilities.buildUrl(environment.graphUrl, 'users', [localAccountId, 'photo', '$value']));
    expect(request.request.method).toEqual('GET');
    request.flush(picture);

    const actual = await promise;
    expect(actual.constructor.name).toEqual('SafeUrlImpl');
  }));
});
