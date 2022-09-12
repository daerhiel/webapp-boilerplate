import { inject, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeValue } from '@angular/platform-browser';
import { AccountInfo } from '@azure/msal-browser';
import { firstValueFrom, Observable } from 'rxjs';

import * as uuid from 'uuid';

import { environment } from '@environments/environment';
import { GraphClientService } from '../graph-client.service';
import { GraphPicturePipe } from './graph-picture.pipe';
import { buildUrl } from '../structure/url-utilities';

const tenantId = uuid.v4();
const localAccountId = uuid.v4();
const username = 'user.name@microsoft.com';
const account = {
  homeAccountId: `${uuid.v4()}.${uuid.v4()}`,
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
  beforeEach(async () => {
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
    const request = controller.expectOne(buildUrl(environment.graphUrl, 'users', [localAccountId, 'photo', '$value']));
    expect(request.request.method).toEqual('GET');
    request.flush(picture);

    const actual = await promise;
    expect(actual.constructor.name).toEqual('SafeUrlImpl');
  }));

  it('should transform account info from cached picture', inject([GraphClientService, DomSanitizer], async (graph: GraphClientService, sanitizer: DomSanitizer) => {
    clearGraphPipeCache();

    const pipe = new GraphPicturePipe(graph, sanitizer);
    const promise1 = firstValueFrom(pipe.transform(account));
    const request1 = controller.expectOne(buildUrl(environment.graphUrl, 'users', [localAccountId, 'photo', '$value']));
    expect(request1.request.method).toEqual('GET');
    request1.flush(picture);

    const expected = await promise1;

    const promise2 = firstValueFrom(pipe.transform(account));
    controller.expectNone(buildUrl(environment.graphUrl, 'users', [localAccountId, 'photo', '$value']));

    const actual = await promise2;

    expect(actual).toEqual(expected);
  }));

  it('should set picture to component', async () => {
    clearGraphPipeCache();

    const fixture = TestBed.createComponent(TestComponent);
    const element: HTMLElement = fixture.nativeElement;

    fixture.detectChanges();

    const request = controller.expectOne(buildUrl(environment.graphUrl, 'users', [localAccountId, 'photo', '$value']));
    expect(request.request.method).toEqual('GET');
    request.flush(picture);

    fixture.detectChanges();
    await fixture.whenStable();

    const img = element.querySelector('img');
    expect(img).not.toBeNull();
    expect(img!.src).toMatch(/^blob:http:/i);
  });
});
