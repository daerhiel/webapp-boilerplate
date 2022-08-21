import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

import { environment } from '@environments/environment';
import { UserIdentityApi } from './graph/user-identity-api';
import { UrlUtilities } from './structure/url-utilities';

@Injectable({
  providedIn: 'root'
})
export class GraphClientService implements OnDestroy {
  private readonly subscriptions: Subscription[] = [];
  private readonly apiUrl: string = environment.graphUrl;

  constructor(private http: HttpClient) {
  }

  ngOnDestroy(): void {
    while (this.subscriptions.length > 0) {
      this.subscriptions.shift()?.unsubscribe();
    }
  }

  getMe() : Observable<UserIdentityApi>{
    return this.http.get<UserIdentityApi>(UrlUtilities.buildUrl(this.apiUrl, 'me'));
  }

  getMyPhoto(): Observable<Blob> {
    return this.http.get(UrlUtilities.buildUrl(this.apiUrl, 'me', ['photo', '$value']), { responseType: 'blob' });
  }

  getPhoto(id: string): Observable<Blob> {
    return this.http.get(UrlUtilities.buildUrl(this.apiUrl, 'users', [id, 'photo', '$value']), { responseType: 'blob' });
  }
}
