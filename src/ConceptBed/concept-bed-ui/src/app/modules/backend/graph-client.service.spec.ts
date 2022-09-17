import { inject, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { firstValueFrom } from 'rxjs';

import { localAccountId, picture, tenant, username } from '@app/spec/helpers';
import { environment } from '@environments/environment';
import { GraphClientService } from './graph-client.service';
import { buildUrl } from './structure/url-utilities';

export const userPrincipalName = `${username.replace('@', '_')}#EXT#@${tenant}`;
export const givenName = 'User';
export const surname = 'Name';
export const displayName = `${givenName} ${surname}`;
export const user = {
  id: localAccountId, userPrincipalName, displayName, givenName, surname,
  jobTitle: null, mail: null, mobilePhone: null, businessPhones: [],
  officeLocation: null,
  preferredLanguage: null,
  '@odata.context': 'https://graph.microsoft.com/v1.0/$metadata#users/$entity'
}
export function graphApiMock(controller: HttpTestingController, result: any, root: string, actions?: string[]): void {
  const request = controller.expectOne(buildUrl(environment.graphUrl, root, actions));
  expect(request.request.method).toEqual('GET');
  request.flush(result);
}

describe('GraphClientService', () => {
  let controller: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
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

    graphApiMock(controller, user, 'me');

    const actual = await promise;
    expect(actual).toEqual(user);
  }));

  it('should get current user picture', inject([GraphClientService], async (graph: GraphClientService) => {
    const promise = firstValueFrom(graph.getMyPhoto());

    graphApiMock(controller, picture, 'me', ['photo', '$value']);

    const actual = await promise;
    expect(actual).toEqual(picture);
  }));

  it('should get user picture', inject([GraphClientService], async (graph: GraphClientService) => {
    const promise = firstValueFrom(graph.getPhoto(localAccountId));

    graphApiMock(controller, picture, 'users', [localAccountId, 'photo', '$value']);

    const actual = await promise;
    expect(actual).toEqual(picture);
  }));
});
