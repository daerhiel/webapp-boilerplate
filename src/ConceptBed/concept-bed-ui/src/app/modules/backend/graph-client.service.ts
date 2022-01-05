import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

import { environment } from 'src/environments/environment';
import { UserIdentityApi } from './graph/user-identity-api';
import { UrlUtilities } from './structure/url-utilities';

@Injectable({
  providedIn: 'root'
})
export class GraphClientService implements OnDestroy {
  private readonly subscriptions: Subscription[] = [];
  private readonly apiUrl: string = environment.graphUrl;

  public constructor(private http: HttpClient) {
  }

  public ngOnDestroy(): void {
    while (this.subscriptions.length > 0) {
      this.subscriptions.shift()?.unsubscribe();
    }
  }

  public getMe() : Observable<UserIdentityApi>{
    return this.http.get<UserIdentityApi>(UrlUtilities.buildUrl(this.apiUrl, 'me'));
  }

  public getMyPhoto(): Observable<Blob> {
    return this.http.get(UrlUtilities.buildUrl(this.apiUrl, 'me', ['photo', '$value']), { responseType: 'blob' });
  }

  public getPhoto(id: string): Observable<Blob> {
    return this.http.get(UrlUtilities.buildUrl(this.apiUrl, 'users', [id, 'photo', '$value']), { responseType: 'blob' });
  }
}
