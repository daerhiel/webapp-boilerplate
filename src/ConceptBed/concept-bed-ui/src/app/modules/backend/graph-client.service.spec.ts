import { inject, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { GraphClientService } from './graph-client.service';
import { lastValueFrom } from 'rxjs';

describe('GraphClientService', () => {
  let controller: HttpTestingController;
  const localAccountId = 'abcdef01-1234-5678-90ab-abcdef012345';
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

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ]
    }).compileComponents();
    controller = TestBed.inject(HttpTestingController);
  });

  it('should be created', inject([GraphClientService], async (graph: GraphClientService) => {
    expect(graph).toBeTruthy();
  }));

  it('should get current user', inject([GraphClientService], async (graph: GraphClientService) => {
    const promise = lastValueFrom(graph.getMe());

    const request = controller.expectOne(`https://graph.microsoft.com/v1.0/me`);
    expect(request.request.method).toEqual('GET');
    request.flush(user);

    const actual = await promise;
    expect(actual).toEqual(user);
  }));

  it('should get current user picture', inject([GraphClientService], async (graph: GraphClientService) => {
    const promise = lastValueFrom(graph.getMyPhoto());
    const picture = new Blob(['picture'], { type: 'image/png' });

    const request = controller.expectOne(`https://graph.microsoft.com/v1.0/me/photo/$value`);
    expect(request.request.method).toEqual('GET');
    request.flush(picture);

    const actual = await promise;
    expect(actual).toEqual(picture);
  }));

  it('should get user picture', inject([GraphClientService], async (graph: GraphClientService) => {
    const promise = lastValueFrom(graph.getPhoto(localAccountId));
    const picture = new Blob(['picture'], { type: 'image/png' });

    const request = controller.expectOne(`https://graph.microsoft.com/v1.0/users/${localAccountId}/photo/$value`);
    expect(request.request.method).toEqual('GET');
    request.flush(picture);

    const actual = await promise;
    expect(actual).toEqual(picture);
  }));
});
