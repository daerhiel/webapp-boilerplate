import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '@environments/environment';
import { UserIdentityApi } from './graph/user-identity-api';
import { buildUrl } from './structure/url-utilities';

@Injectable({
  providedIn: 'root'
})
export class GraphClientService {
  private readonly apiUrl: string = environment.graphUrl;

  constructor(private http: HttpClient) {
  }

  getMe(): Observable<UserIdentityApi> {
    return this.http.get<UserIdentityApi>(buildUrl(this.apiUrl, 'me'));
  }

  getMyPhoto(): Observable<Blob> {
    return this.http.get(buildUrl(this.apiUrl, 'me', ['photo', '$value']), { responseType: 'blob' });
  }

  getPhoto(id: string): Observable<Blob> {
    return this.http.get(buildUrl(this.apiUrl, 'users', [id, 'photo', '$value']), { responseType: 'blob' });
  }
}
