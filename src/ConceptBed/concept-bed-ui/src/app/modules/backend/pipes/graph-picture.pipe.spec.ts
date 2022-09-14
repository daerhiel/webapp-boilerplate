import { inject, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { By, DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { AccountInfo } from '@azure/msal-browser';
import { firstValueFrom } from 'rxjs';

import { environment } from '@environments/environment';
import { CacheInstance } from '@modules/services/services.module';
import { GraphClientService } from '../graph-client.service';
import { account, graphApiMock, localAccountId, picture } from '../graph-client.service.spec';
import { GraphPicturePipe } from './graph-picture.pipe';
import { buildUrl } from '../structure/url-utilities';

export function clearGraphPipeCache(): void {
  const cache: CacheInstance<SafeUrl | undefined> = (GraphPicturePipe as any)._cache;
  if (cache) {
    for (const id in cache) {
      cache[id] = undefined!;
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
    await TestBed.configureTestingModule({
      declarations: [
        TestComponent,
        GraphPicturePipe
      ],
      imports: [
        CommonModule,
        HttpClientTestingModule,
      ]
    }).compileComponents();
    controller = TestBed.inject(HttpTestingController);
  });

  beforeEach(() => {
    clearGraphPipeCache();
  });

  afterEach(() => {
    controller.verify();
  });

  it('should create an instance', inject([GraphClientService, DomSanitizer], async (graph: GraphClientService, sanitizer: DomSanitizer) => {
    const pipe = new GraphPicturePipe(graph, sanitizer);
    expect(pipe).toBeTruthy();
  }));

  it('should transform invalid account to undefined', inject([GraphClientService, DomSanitizer], async (graph: GraphClientService, sanitizer: DomSanitizer) => {
    const pipe = new GraphPicturePipe(graph, sanitizer);
    const promise = firstValueFrom(pipe.transform(null));

    const actual = await promise;
    expect(actual).toEqual(undefined);
  }));

  it('should transform account info into a picture', inject([GraphClientService, DomSanitizer], async (graph: GraphClientService, sanitizer: DomSanitizer) => {
    const pipe = new GraphPicturePipe(graph, sanitizer);
    const promise = firstValueFrom(pipe.transform(account));
    graphApiMock(controller, picture, 'users', [localAccountId, 'photo', '$value']);

    const actual = await promise;
    expect(actual?.constructor.name).toEqual('SafeUrlImpl');
  }));

  it('should transform account info from cached picture', inject([GraphClientService, DomSanitizer], async (graph: GraphClientService, sanitizer: DomSanitizer) => {
    const pipe = new GraphPicturePipe(graph, sanitizer);
    const promise1 = firstValueFrom(pipe.transform(account));
    graphApiMock(controller, picture, 'users', [localAccountId, 'photo', '$value']);

    const expected = await promise1;

    const promise2 = firstValueFrom(pipe.transform(account));
    controller.expectNone(buildUrl(environment.graphUrl, 'users', [localAccountId, 'photo', '$value']));

    const actual = await promise2;

    expect(actual).toEqual(expected);
  }));

  it('should set picture to component', async () => {
    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    graphApiMock(controller, picture, 'users', [localAccountId, 'photo', '$value']);

    await firstValueFrom(GraphPicturePipe.get(account));
    fixture.detectChanges();

    const img = fixture.debugElement.query(By.css('img'));
    expect(img.nativeElement).not.toBeNull();
    expect(img.nativeElement.src).toMatch(/^blob:http:/i);
  });
});
