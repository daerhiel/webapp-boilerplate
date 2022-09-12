import { inject, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { firstValueFrom } from 'rxjs';

import * as uuid from 'uuid';

import { environment } from '@environments/environment';
import { GraphClientService } from './graph-client.service';
import { buildUrl } from './structure/url-utilities';

const localAccountId = uuid.v4();
const tenant = 'domain.onmicrosoft.com';
const username = 'user.name@microsoft.com';
const userPrincipalName = `${username.replace('@', '_')}#EXT#@${tenant}`;
const givenName = 'User';
const surname = 'Name';
const displayName = `${givenName} ${surname}`;
const user = {
  id: localAccountId, userPrincipalName, displayName, givenName, surname,
  jobTitle: null, mail: null, mobilePhone: null, businessPhones: [],
  officeLocation: null,
  preferredLanguage: null,
  '@odata.context': 'https://graph.microsoft.com/v1.0/$metadata#users/$entity'
}
const picture = new Blob([new Uint8Array(window.atob('R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=').split('').map(x => x.charCodeAt(0)))], {
  type: 'image/gif'
});

describe('GraphClientService', () => {
  let controller: HttpTestingController;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ]
    }).compileComponents();
    controller = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    controller.verify();
  });

  it('should be created', inject([GraphClientService], async (graph: GraphClientService) => {
    expect(graph).toBeTruthy();
  }));

  it('should get current user', inject([GraphClientService], async (graph: GraphClientService) => {
    const promise = firstValueFrom(graph.getMe());
    const request = controller.expectOne(buildUrl(environment.graphUrl, 'me'));
    expect(request.request.method).toEqual('GET');
    request.flush(user);

    const actual = await promise;
    expect(actual).toEqual(user);
  }));

  it('should get current user picture', inject([GraphClientService], async (graph: GraphClientService) => {
    const promise = firstValueFrom(graph.getMyPhoto());

    const request = controller.expectOne(buildUrl(environment.graphUrl, 'me', ['photo', '$value']));
    expect(request.request.method).toEqual('GET');
    request.flush(picture);

    const actual = await promise;
    expect(actual).toEqual(picture);
  }));

  it('should get user picture', inject([GraphClientService], async (graph: GraphClientService) => {
    const promise = firstValueFrom(graph.getPhoto(localAccountId));

    const request = controller.expectOne(buildUrl(environment.graphUrl, 'users', [localAccountId, 'photo', '$value']));
    expect(request.request.method).toEqual('GET');
    request.flush(picture);

    const actual = await promise;
    expect(actual).toEqual(picture);
  }));
});
