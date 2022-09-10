import { inject, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeValue } from '@angular/platform-browser';
import { AccountInfo } from '@azure/msal-browser';
import { firstValueFrom, Observable } from 'rxjs';

import { environment } from '@environments/environment';
import { GraphClientService } from '../graph-client.service';
import { GraphPicturePipe } from './graph-picture.pipe';
import { UrlUtilities } from '../structure/url-utilities';

const tenantId = '00000000-1234-5678-90ab-abcdef012345';
const localAccountId = 'abcdef01-1234-5678-90ab-abcdef012345';
const username = 'user.name@microsoft.com';
const account = {
  homeAccountId: '00000000-0000-0000-c41c-d9a99aaa6fe4.9188040d-6c67-4c5b-b112-36a304b66dad',
  environment: 'login.windows.net', tenantId, username, localAccountId, name: 'User Name'
};
const picture = new Blob([new Uint8Array(window.atob('R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=').split('').map(x => x.charCodeAt(0)))], {
  type: 'image/gif'
});

function clearGraphPipeCache(): void {
  const cache: { [id: string]: Observable<Blob | string | SafeValue> } = (GraphPicturePipe as any).cache;
  if (cache) {
    for (const id in cache) {
      delete cache[id];
    }
  }
}

@Component({
  template: `<img [src]="account | graph | async" />`
})
class TestComponent {
  account: AccountInfo;

  constructor() {
    this.account = account;
  }
}

describe('GraphPicturePipe', () => {
  let controller: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        TestComponent,
        GraphPicturePipe
      ],
      imports: [
        CommonModule,
        HttpClientTestingModule,
      ],
      providers: []
    }).compileComponents();
    controller = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    controller.verify();
  });

  it('should create an instance', inject([GraphClientService, DomSanitizer], async (graph: GraphClientService, sanitizer: DomSanitizer) => {
    const pipe = new GraphPicturePipe(graph, sanitizer);
    expect(pipe).toBeTruthy();
  }));

  it('should transform account info into a picture', inject([GraphClientService, DomSanitizer], async (graph: GraphClientService, sanitizer: DomSanitizer) => {
    clearGraphPipeCache();

    const pipe = new GraphPicturePipe(graph, sanitizer);
    const promise = firstValueFrom(pipe.transform(account));
    const request = controller.expectOne(UrlUtilities.buildUrl(environment.graphUrl, 'users', [localAccountId, 'photo', '$value']));
    expect(request.request.method).toEqual('GET');
    request.flush(picture);

    const actual = await promise;
    expect(actual.constructor.name).toEqual('SafeUrlImpl');
  }));

  it('should transform account info from cached a picture', inject([GraphClientService, DomSanitizer], async (graph: GraphClientService, sanitizer: DomSanitizer) => {
    clearGraphPipeCache();

    const pipe = new GraphPicturePipe(graph, sanitizer);
    const promise1 = firstValueFrom(pipe.transform(account));
    const request1 = controller.expectOne(UrlUtilities.buildUrl(environment.graphUrl, 'users', [localAccountId, 'photo', '$value']));
    expect(request1.request.method).toEqual('GET');
    request1.flush(picture);

    const expected = await promise1;

    const promise2 = firstValueFrom(pipe.transform(account));
    const request2 = controller.expectOne(UrlUtilities.buildUrl(environment.graphUrl, 'users', [localAccountId, 'photo', '$value']));
    expect(request2.request.method).toEqual('GET');
    request2.flush(picture);

    const actual = await promise2;

    expect(actual).toEqual(expected);
  }));

  it('should set picture to component', async () => {
    clearGraphPipeCache();

    const fixture = TestBed.createComponent(TestComponent);
    const element: HTMLElement = fixture.nativeElement;

    fixture.detectChanges();

    const request = controller.expectOne(UrlUtilities.buildUrl(environment.graphUrl, 'users', [localAccountId, 'photo', '$value']));
    expect(request.request.method).toEqual('GET');
    request.flush(picture);

    fixture.detectChanges();
    await fixture.whenStable();

    const img = element.querySelector('img');
    expect(img).not.toBeNull();
    expect(img!.src).toMatch(/^blob:http:/i);
  });
});
